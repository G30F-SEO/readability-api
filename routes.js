const express = require('express');
const db = require('./database');

const router = express.Router();

// ==================== EXERCISES ROUTES ====================

// Get all exercises
router.get('/exercises', (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let query = 'SELECT * FROM exercises';
    const params = [];

    if (category || difficulty) {
      query += ' WHERE';
      if (category) {
        query += ' category = ?';
        params.push(category);
      }
      if (difficulty) {
        query += category ? ' AND difficulty = ?' : ' difficulty = ?';
        params.push(difficulty);
      }
    }

    query += ' ORDER BY name';
    const exercises = db.prepare(query).all(...params);
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single exercise
router.get('/exercises/:id', (req, res) => {
  try {
    const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create exercise
router.post('/exercises', (req, res) => {
  try {
    const { name, description, category, equipment, difficulty, video_url } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const result = db.prepare(`
      INSERT INTO exercises (name, description, category, equipment, difficulty, video_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, description, category, equipment, difficulty, video_url);

    const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(exercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update exercise
router.put('/exercises/:id', (req, res) => {
  try {
    const { name, description, category, equipment, difficulty, video_url } = req.body;

    db.prepare(`
      UPDATE exercises
      SET name = ?, description = ?, category = ?, equipment = ?, difficulty = ?, video_url = ?
      WHERE id = ?
    `).run(name, description, category, equipment, difficulty, video_url, req.params.id);

    const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id);
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete exercise
router.delete('/exercises/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM exercises WHERE id = ?').run(req.params.id);
    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PROGRAMS ROUTES ====================

// Get all programs
router.get('/programs', (req, res) => {
  try {
    const programs = db.prepare('SELECT * FROM programs ORDER BY created_at DESC').all();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single program with WODs
router.get('/programs/:id', (req, res) => {
  try {
    const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(req.params.id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const wods = db.prepare('SELECT * FROM wods WHERE program_id = ? ORDER BY day_number').all(req.params.id);
    program.wods = wods;

    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create program
router.post('/programs', (req, res) => {
  try {
    const { name, description, duration_weeks, difficulty, goal } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = db.prepare(`
      INSERT INTO programs (name, description, duration_weeks, difficulty, goal)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, description, duration_weeks, difficulty, goal);

    const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update program
router.put('/programs/:id', (req, res) => {
  try {
    const { name, description, duration_weeks, difficulty, goal } = req.body;

    db.prepare(`
      UPDATE programs
      SET name = ?, description = ?, duration_weeks = ?, difficulty = ?, goal = ?
      WHERE id = ?
    `).run(name, description, duration_weeks, difficulty, goal, req.params.id);

    const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(req.params.id);
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete program
router.delete('/programs/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM programs WHERE id = ?').run(req.params.id);
    res.json({ message: 'Program deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== WODS ROUTES ====================

// Get all WODs
router.get('/wods', (req, res) => {
  try {
    const { program_id } = req.query;
    let query = 'SELECT * FROM wods';
    const params = [];

    if (program_id) {
      query += ' WHERE program_id = ?';
      params.push(program_id);
    }

    query += ' ORDER BY day_number';
    const wods = db.prepare(query).all(...params);
    res.json(wods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single WOD with exercises
router.get('/wods/:id', (req, res) => {
  try {
    const wod = db.prepare('SELECT * FROM wods WHERE id = ?').get(req.params.id);
    if (!wod) {
      return res.status(404).json({ error: 'WOD not found' });
    }

    const exercises = db.prepare(`
      SELECT we.*, e.name, e.description, e.category
      FROM wod_exercises we
      JOIN exercises e ON we.exercise_id = e.id
      WHERE we.wod_id = ?
      ORDER BY we.order_index
    `).all(req.params.id);

    wod.exercises = exercises;
    res.json(wod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create WOD
router.post('/wods', (req, res) => {
  try {
    const { program_id, name, description, wod_type, duration_minutes, rounds, day_number, notes, exercises } = req.body;

    if (!name || !wod_type) {
      return res.status(400).json({ error: 'Name and WOD type are required' });
    }

    const result = db.prepare(`
      INSERT INTO wods (program_id, name, description, wod_type, duration_minutes, rounds, day_number, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(program_id, name, description, wod_type, duration_minutes, rounds, day_number, notes);

    const wodId = result.lastInsertRowid;

    // Add exercises if provided
    if (exercises && Array.isArray(exercises)) {
      const insertExercise = db.prepare(`
        INSERT INTO wod_exercises (wod_id, exercise_id, reps, duration_seconds, weight_kg, distance_meters, order_index, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      exercises.forEach((ex, index) => {
        insertExercise.run(wodId, ex.exercise_id, ex.reps, ex.duration_seconds, ex.weight_kg, ex.distance_meters, index, ex.notes);
      });
    }

    const wod = db.prepare('SELECT * FROM wods WHERE id = ?').get(wodId);
    res.status(201).json(wod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update WOD
router.put('/wods/:id', (req, res) => {
  try {
    const { name, description, wod_type, duration_minutes, rounds, day_number, notes, exercises } = req.body;

    db.prepare(`
      UPDATE wods
      SET name = ?, description = ?, wod_type = ?, duration_minutes = ?, rounds = ?, day_number = ?, notes = ?
      WHERE id = ?
    `).run(name, description, wod_type, duration_minutes, rounds, day_number, notes, req.params.id);

    // Update exercises if provided
    if (exercises && Array.isArray(exercises)) {
      // Delete existing exercises
      db.prepare('DELETE FROM wod_exercises WHERE wod_id = ?').run(req.params.id);

      // Insert new exercises
      const insertExercise = db.prepare(`
        INSERT INTO wod_exercises (wod_id, exercise_id, reps, duration_seconds, weight_kg, distance_meters, order_index, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      exercises.forEach((ex, index) => {
        insertExercise.run(req.params.id, ex.exercise_id, ex.reps, ex.duration_seconds, ex.weight_kg, ex.distance_meters, index, ex.notes);
      });
    }

    const wod = db.prepare('SELECT * FROM wods WHERE id = ?').get(req.params.id);
    res.json(wod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete WOD
router.delete('/wods/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM wods WHERE id = ?').run(req.params.id);
    res.json({ message: 'WOD deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PROGRESS ROUTES ====================

// Get all progress entries
router.get('/progress', (req, res) => {
  try {
    const { wod_id } = req.query;
    let query = `
      SELECT p.*, w.name as wod_name, w.wod_type
      FROM progress p
      JOIN wods w ON p.wod_id = w.id
    `;
    const params = [];

    if (wod_id) {
      query += ' WHERE p.wod_id = ?';
      params.push(wod_id);
    }

    query += ' ORDER BY p.completed_at DESC';
    const progress = db.prepare(query).all(...params);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create progress entry
router.post('/progress', (req, res) => {
  try {
    const { wod_id, rounds_completed, time_seconds, weight_used_kg, notes, rating } = req.body;

    if (!wod_id) {
      return res.status(400).json({ error: 'WOD ID is required' });
    }

    const result = db.prepare(`
      INSERT INTO progress (wod_id, rounds_completed, time_seconds, weight_used_kg, notes, rating)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(wod_id, rounds_completed, time_seconds, weight_used_kg, notes, rating);

    const progress = db.prepare('SELECT * FROM progress WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete progress entry
router.delete('/progress/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM progress WHERE id = ?').run(req.params.id);
    res.json({ message: 'Progress entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PROGRAM GENERATOR ====================

// Generate automatic program
router.post('/programs/generate', (req, res) => {
  try {
    const { difficulty, duration_weeks, goal } = req.body;

    if (!difficulty || !duration_weeks) {
      return res.status(400).json({ error: 'Difficulty and duration are required' });
    }

    // Create the program
    const programResult = db.prepare(`
      INSERT INTO programs (name, description, duration_weeks, difficulty, goal)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      `Programme ${difficulty} - ${duration_weeks} semaines`,
      `Programme généré automatiquement pour ${goal || 'amélioration générale'}`,
      duration_weeks,
      difficulty,
      goal
    );

    const programId = programResult.lastInsertRowid;

    // Get exercises by difficulty
    const exercises = db.prepare('SELECT * FROM exercises WHERE difficulty = ? OR difficulty IS NULL').all(difficulty);

    if (exercises.length === 0) {
      return res.status(400).json({ error: 'No exercises found for this difficulty level' });
    }

    // WOD types to cycle through
    const wodTypes = ['AMRAP', 'For Time', 'EMOM', 'Tabata'];
    const daysPerWeek = 5;
    const totalDays = duration_weeks * daysPerWeek;

    // Generate WODs for each day
    for (let day = 1; day <= totalDays; day++) {
      const wodType = wodTypes[(day - 1) % wodTypes.length];
      const weekNumber = Math.ceil(day / daysPerWeek);
      const dayOfWeek = ((day - 1) % daysPerWeek) + 1;

      let duration, rounds;

      switch (wodType) {
        case 'AMRAP':
          duration = difficulty === 'débutant' ? 12 : difficulty === 'intermédiaire' ? 15 : 20;
          rounds = null;
          break;
        case 'For Time':
          duration = null;
          rounds = difficulty === 'débutant' ? 3 : difficulty === 'intermédiaire' ? 5 : 7;
          break;
        case 'EMOM':
          duration = difficulty === 'débutant' ? 10 : difficulty === 'intermédiaire' ? 15 : 20;
          rounds = null;
          break;
        case 'Tabata':
          duration = 4;
          rounds = 8;
          break;
      }

      const wodResult = db.prepare(`
        INSERT INTO wods (program_id, name, description, wod_type, duration_minutes, rounds, day_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        programId,
        `Semaine ${weekNumber} - Jour ${dayOfWeek}`,
        `${wodType} workout`,
        wodType,
        duration,
        rounds,
        day
      );

      const wodId = wodResult.lastInsertRowid;

      // Add 3-5 random exercises to each WOD
      const numExercises = Math.floor(Math.random() * 3) + 3;
      const shuffled = exercises.sort(() => 0.5 - Math.random());
      const selectedExercises = shuffled.slice(0, numExercises);

      const insertExercise = db.prepare(`
        INSERT INTO wod_exercises (wod_id, exercise_id, reps, order_index)
        VALUES (?, ?, ?, ?)
      `);

      selectedExercises.forEach((ex, index) => {
        const reps = difficulty === 'débutant' ? 10 : difficulty === 'intermédiaire' ? 15 : 21;
        insertExercise.run(wodId, ex.id, reps, index);
      });
    }

    // Return the generated program with WODs
    const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(programId);
    const wods = db.prepare('SELECT * FROM wods WHERE program_id = ? ORDER BY day_number').all(programId);
    program.wods = wods;

    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get exercise categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM exercises ORDER BY category').all();
    res.json(categories.map(c => c.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
