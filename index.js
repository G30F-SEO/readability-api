const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const { seedDatabase } = require('./seed');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Seed database on startup
seedDatabase();

// CrossFit API routes
app.use('/api', routes);

// Original readability endpoint (kept for backward compatibility)
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

// Serve the main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CrossFit Program Builder running on port ${PORT}`));
