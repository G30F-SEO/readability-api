const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'crossfit.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Table des exercices
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    equipment TEXT,
    difficulty TEXT CHECK(difficulty IN ('débutant', 'intermédiaire', 'avancé')),
    video_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Table des programmes
  CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    duration_weeks INTEGER,
    difficulty TEXT CHECK(difficulty IN ('débutant', 'intermédiaire', 'avancé')),
    goal TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Table des WODs (Workout of the Day)
  CREATE TABLE IF NOT EXISTS wods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    program_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    wod_type TEXT CHECK(wod_type IN ('AMRAP', 'For Time', 'EMOM', 'Tabata', 'Chipper', 'Custom')),
    duration_minutes INTEGER,
    rounds INTEGER,
    day_number INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
  );

  -- Table de liaison WOD-Exercices
  CREATE TABLE IF NOT EXISTS wod_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wod_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    reps INTEGER,
    duration_seconds INTEGER,
    weight_kg REAL,
    distance_meters INTEGER,
    order_index INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (wod_id) REFERENCES wods(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
  );

  -- Table de suivi de progression
  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wod_id INTEGER NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    rounds_completed INTEGER,
    time_seconds INTEGER,
    weight_used_kg REAL,
    notes TEXT,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    FOREIGN KEY (wod_id) REFERENCES wods(id) ON DELETE CASCADE
  );

  -- Index pour améliorer les performances
  CREATE INDEX IF NOT EXISTS idx_wods_program ON wods(program_id);
  CREATE INDEX IF NOT EXISTS idx_wod_exercises_wod ON wod_exercises(wod_id);
  CREATE INDEX IF NOT EXISTS idx_progress_wod ON progress(wod_id);
`);

console.log('Database initialized successfully');

module.exports = db;
