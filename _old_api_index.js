const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

const app = express();
app.use(express.json());

app.post('/parse', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL in request body' });
  }

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });

    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return res.status(500).json({ error: 'Could not parse article content' });
    }

    res.json({
      title: article.title,
      content: article.textContent.slice(0, 10000).trim(),
      excerpt: article.excerpt || null,
      byline: article.byline || null
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Readability API running on port ${PORT}`));
