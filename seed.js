const db = require('./database');

// Sample exercises data
const exercises = [
  // Gymnastique
  { name: 'Pull-ups', description: 'Tractions à la barre', category: 'Gymnastique', equipment: 'Barre de traction', difficulty: 'intermédiaire' },
  { name: 'Push-ups', description: 'Pompes au sol', category: 'Gymnastique', equipment: 'Aucun', difficulty: 'débutant' },
  { name: 'Air Squats', description: 'Squats au poids du corps', category: 'Gymnastique', equipment: 'Aucun', difficulty: 'débutant' },
  { name: 'Burpees', description: 'Burpees complets', category: 'Gymnastique', equipment: 'Aucun', difficulty: 'intermédiaire' },
  { name: 'Box Jumps', description: 'Sauts sur box', category: 'Gymnastique', equipment: 'Box', difficulty: 'intermédiaire' },
  { name: 'Handstand Push-ups', description: 'Pompes en poirier', category: 'Gymnastique', equipment: 'Mur', difficulty: 'avancé' },
  { name: 'Muscle-ups', description: 'Muscle-ups aux anneaux', category: 'Gymnastique', equipment: 'Anneaux', difficulty: 'avancé' },
  { name: 'Toes to Bar', description: 'Pieds à la barre', category: 'Gymnastique', equipment: 'Barre', difficulty: 'avancé' },

  // Haltérophilie
  { name: 'Deadlift', description: 'Soulevé de terre', category: 'Haltérophilie', equipment: 'Barre', difficulty: 'intermédiaire' },
  { name: 'Back Squat', description: 'Squat avec barre sur le dos', category: 'Haltérophilie', equipment: 'Barre', difficulty: 'intermédiaire' },
  { name: 'Front Squat', description: 'Squat avec barre devant', category: 'Haltérophilie', equipment: 'Barre', difficulty: 'intermédiaire' },
  { name: 'Clean', description: 'Épaulé', category: 'Haltérophilie', equipment: 'Barre', difficulty: 'avancé' },
  { name: 'Snatch', description: 'Arraché', category: 'Haltérophilie', equipment: 'Barre', difficulty: 'avancé' },
  { name: 'Thruster', description: 'Squat + push press', category: 'Haltérophilie', equipment: 'Barre', difficulty: 'intermédiaire' },
  { name: 'Overhead Squat', description: 'Squat bras tendus', category: 'Haltérophilie', equipment: 'Barre', difficulty: 'avancé' },

  // Cardio
  { name: 'Running', description: 'Course à pied', category: 'Cardio', equipment: 'Aucun', difficulty: 'débutant' },
  { name: 'Rowing', description: 'Rameur', category: 'Cardio', equipment: 'Rameur', difficulty: 'débutant' },
  { name: 'Assault Bike', description: 'Vélo d\'assaut', category: 'Cardio', equipment: 'Assault Bike', difficulty: 'débutant' },
  { name: 'Double Unders', description: 'Double sauts à la corde', category: 'Cardio', equipment: 'Corde à sauter', difficulty: 'intermédiaire' },
  { name: 'Jump Rope', description: 'Corde à sauter simple', category: 'Cardio', equipment: 'Corde à sauter', difficulty: 'débutant' },

  // Kettlebell
  { name: 'Kettlebell Swings', description: 'Balancés avec kettlebell', category: 'Kettlebell', equipment: 'Kettlebell', difficulty: 'débutant' },
  { name: 'Goblet Squat', description: 'Squat avec kettlebell', category: 'Kettlebell', equipment: 'Kettlebell', difficulty: 'débutant' },
  { name: 'Turkish Get-up', description: 'Relevé turc', category: 'Kettlebell', equipment: 'Kettlebell', difficulty: 'avancé' },

  // Core
  { name: 'Sit-ups', description: 'Redressements assis', category: 'Core', equipment: 'Aucun', difficulty: 'débutant' },
  { name: 'Plank', description: 'Gainage', category: 'Core', equipment: 'Aucun', difficulty: 'débutant' },
  { name: 'V-ups', description: 'V-ups', category: 'Core', equipment: 'Aucun', difficulty: 'intermédiaire' },
  { name: 'GHD Sit-ups', description: 'Redressements sur GHD', category: 'Core', equipment: 'GHD', difficulty: 'avancé' },

  // Haltères
  { name: 'Dumbbell Snatch', description: 'Arraché avec haltère', category: 'Haltères', equipment: 'Haltères', difficulty: 'intermédiaire' },
  { name: 'Dumbbell Clean', description: 'Épaulé avec haltère', category: 'Haltères', equipment: 'Haltères', difficulty: 'intermédiaire' },
  { name: 'Wall Balls', description: 'Lancers de medecine ball au mur', category: 'Haltères', equipment: 'Medicine ball', difficulty: 'débutant' },
];

function seedDatabase() {
  try {
    // Check if exercises already exist
    const count = db.prepare('SELECT COUNT(*) as count FROM exercises').get();

    if (count.count > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    const insert = db.prepare(`
      INSERT INTO exercises (name, description, category, equipment, difficulty)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((exercises) => {
      for (const ex of exercises) {
        insert.run(ex.name, ex.description, ex.category, ex.equipment, ex.difficulty);
      }
    });

    insertMany(exercises);
    console.log(`✓ Seeded ${exercises.length} exercises`);
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
