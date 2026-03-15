const API_URL = '/api';

// State
let exercises = [];
let programs = [];
let wods = [];
let progressEntries = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    loadAllData();
});

// Tab Management
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');

    if (tabName === 'exercises') loadExercises();
    if (tabName === 'programs') loadPrograms();
    if (tabName === 'wods') loadWods();
    if (tabName === 'progress') loadProgress();
}

// Load all data
async function loadAllData() {
    await loadExercises();
    await loadPrograms();
    await loadWods();
    await loadProgress();
}

// ==================== EXERCISES ====================

async function loadExercises() {
    try {
        const response = await fetch(`${API_URL}/exercises`);
        exercises = await response.json();
        renderExercises();
    } catch (err) {
        console.error('Error loading exercises:', err);
    }
}

function renderExercises() {
    const container = document.getElementById('exercises-list');

    if (exercises.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Aucun exercice</h3><p>Commencez par ajouter des exercices à votre bibliothèque</p></div>';
        return;
    }

    container.innerHTML = exercises.map(ex => `
        <div class="card">
            <h3>${ex.name}</h3>
            <p>${ex.description || 'Pas de description'}</p>
            <div style="margin-top: 10px;">
                <span class="badge badge-${getDifficultyClass(ex.difficulty)}">${ex.difficulty || 'N/A'}</span>
                <span style="color: #666;">📦 ${ex.equipment || 'Aucun équipement'}</span>
            </div>
            <div style="margin-top: 5px; color: #667eea; font-weight: 600;">
                ${ex.category}
            </div>
            <div class="card-actions">
                <button class="btn btn-danger" onclick="deleteExercise(${ex.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

function getDifficultyClass(difficulty) {
    if (difficulty === 'débutant') return 'beginner';
    if (difficulty === 'intermédiaire') return 'intermediate';
    if (difficulty === 'avancé') return 'advanced';
    return 'beginner';
}

function openExerciseModal() {
    document.getElementById('exercise-modal').classList.add('active');
}

async function saveExercise(event) {
    event.preventDefault();

    const exercise = {
        name: document.getElementById('exercise-name').value,
        description: document.getElementById('exercise-description').value,
        category: document.getElementById('exercise-category').value,
        equipment: document.getElementById('exercise-equipment').value,
        difficulty: document.getElementById('exercise-difficulty').value
    };

    try {
        const response = await fetch(`${API_URL}/exercises`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exercise)
        });

        if (response.ok) {
            closeModal('exercise-modal');
            event.target.reset();
            await loadExercises();
        }
    } catch (err) {
        console.error('Error saving exercise:', err);
        alert('Erreur lors de la sauvegarde de l\'exercice');
    }
}

async function deleteExercise(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) return;

    try {
        await fetch(`${API_URL}/exercises/${id}`, { method: 'DELETE' });
        await loadExercises();
    } catch (err) {
        console.error('Error deleting exercise:', err);
    }
}

// ==================== PROGRAMS ====================

async function loadPrograms() {
    try {
        const response = await fetch(`${API_URL}/programs`);
        programs = await response.json();
        renderPrograms();
        updateProgramSelect();
    } catch (err) {
        console.error('Error loading programs:', err);
    }
}

function renderPrograms() {
    const container = document.getElementById('programs-list');

    if (programs.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Aucun programme</h3><p>Créez votre premier programme d\'entraînement</p></div>';
        return;
    }

    container.innerHTML = programs.map(program => `
        <div class="card">
            <h3>${program.name}</h3>
            <p>${program.description || 'Pas de description'}</p>
            <div style="margin-top: 10px;">
                <span class="badge badge-${getDifficultyClass(program.difficulty)}">${program.difficulty || 'N/A'}</span>
                ${program.duration_weeks ? `<span>📅 ${program.duration_weeks} semaines</span>` : ''}
                ${program.goal ? `<span style="color: #666;"> 🎯 ${program.goal}</span>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn" onclick="viewProgram(${program.id})">Voir détails</button>
                <button class="btn btn-danger" onclick="deleteProgram(${program.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

function updateProgramSelect() {
    const select = document.getElementById('wod-program');
    select.innerHTML = '<option value="">Aucun programme</option>' +
        programs.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function openProgramModal() {
    document.getElementById('program-modal').classList.add('active');
}

async function saveProgram(event) {
    event.preventDefault();

    const program = {
        name: document.getElementById('program-name').value,
        description: document.getElementById('program-description').value,
        duration_weeks: parseInt(document.getElementById('program-duration').value) || null,
        difficulty: document.getElementById('program-difficulty').value,
        goal: document.getElementById('program-goal').value
    };

    try {
        const response = await fetch(`${API_URL}/programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(program)
        });

        if (response.ok) {
            closeModal('program-modal');
            event.target.reset();
            await loadPrograms();
        }
    } catch (err) {
        console.error('Error saving program:', err);
        alert('Erreur lors de la sauvegarde du programme');
    }
}

async function viewProgram(id) {
    try {
        const response = await fetch(`${API_URL}/programs/${id}`);
        const program = await response.json();

        alert(`Programme: ${program.name}\n\nNombre de WODs: ${program.wods?.length || 0}\n\nUtilisez l'onglet WODs pour voir les détails`);
    } catch (err) {
        console.error('Error viewing program:', err);
    }
}

async function deleteProgram(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ? Tous les WODs associés seront également supprimés.')) return;

    try {
        await fetch(`${API_URL}/programs/${id}`, { method: 'DELETE' });
        await loadPrograms();
    } catch (err) {
        console.error('Error deleting program:', err);
    }
}

// ==================== WODS ====================

async function loadWods() {
    try {
        const response = await fetch(`${API_URL}/wods`);
        wods = await response.json();
        renderWods();
    } catch (err) {
        console.error('Error loading WODs:', err);
    }
}

function renderWods() {
    const container = document.getElementById('wods-list');

    if (wods.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Aucun WOD</h3><p>Créez votre premier workout</p></div>';
        return;
    }

    container.innerHTML = wods.map(wod => `
        <div class="card">
            <h3>${wod.name}</h3>
            <p>${wod.description || ''}</p>
            <div style="margin-top: 10px;">
                <span class="badge" style="background: #667eea; color: white;">${wod.wod_type}</span>
                ${wod.duration_minutes ? `<span>⏱️ ${wod.duration_minutes} min</span>` : ''}
                ${wod.rounds ? `<span>🔄 ${wod.rounds} rounds</span>` : ''}
                ${wod.day_number ? `<span>📅 Jour ${wod.day_number}</span>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn" onclick="viewWod(${wod.id})">Voir détails</button>
                <button class="btn btn-success" onclick="logProgress(${wod.id})">Enregistrer performance</button>
                <button class="btn btn-danger" onclick="deleteWod(${wod.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

function openWodModal() {
    document.getElementById('wod-modal').classList.add('active');
}

async function saveWod(event) {
    event.preventDefault();

    const wod = {
        program_id: document.getElementById('wod-program').value || null,
        name: document.getElementById('wod-name').value,
        description: document.getElementById('wod-description').value,
        wod_type: document.getElementById('wod-type').value,
        duration_minutes: parseInt(document.getElementById('wod-duration').value) || null,
        rounds: parseInt(document.getElementById('wod-rounds').value) || null
    };

    try {
        const response = await fetch(`${API_URL}/wods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wod)
        });

        if (response.ok) {
            closeModal('wod-modal');
            event.target.reset();
            await loadWods();
        }
    } catch (err) {
        console.error('Error saving WOD:', err);
        alert('Erreur lors de la sauvegarde du WOD');
    }
}

async function viewWod(id) {
    try {
        const response = await fetch(`${API_URL}/wods/${id}`);
        const wod = await response.json();

        let message = `WOD: ${wod.name}\nType: ${wod.wod_type}\n`;
        if (wod.duration_minutes) message += `Durée: ${wod.duration_minutes} min\n`;
        if (wod.rounds) message += `Rounds: ${wod.rounds}\n`;

        if (wod.exercises && wod.exercises.length > 0) {
            message += '\nExercices:\n';
            wod.exercises.forEach(ex => {
                message += `- ${ex.name}`;
                if (ex.reps) message += ` x${ex.reps}`;
                if (ex.weight_kg) message += ` @ ${ex.weight_kg}kg`;
                message += '\n';
            });
        }

        alert(message);
    } catch (err) {
        console.error('Error viewing WOD:', err);
    }
}

async function deleteWod(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce WOD ?')) return;

    try {
        await fetch(`${API_URL}/wods/${id}`, { method: 'DELETE' });
        await loadWods();
    } catch (err) {
        console.error('Error deleting WOD:', err);
    }
}

function logProgress(wodId) {
    const rounds = prompt('Nombre de rounds complétés:');
    const time = prompt('Temps en secondes:');
    const rating = prompt('Note de 1 à 5:');

    if (rounds || time || rating) {
        saveProgress(wodId, rounds, time, rating);
    }
}

// ==================== PROGRESS ====================

async function loadProgress() {
    try {
        const response = await fetch(`${API_URL}/progress`);
        progressEntries = await response.json();
        renderProgress();
    } catch (err) {
        console.error('Error loading progress:', err);
    }
}

function renderProgress() {
    const container = document.getElementById('progress-list');
    const statsContainer = document.getElementById('progress-stats');

    // Stats
    const totalWorkouts = progressEntries.length;
    const avgRating = totalWorkouts > 0
        ? (progressEntries.reduce((sum, p) => sum + (p.rating || 0), 0) / totalWorkouts).toFixed(1)
        : 0;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>${totalWorkouts}</h3>
            <p>Workouts complétés</p>
        </div>
        <div class="stat-card">
            <h3>${avgRating}⭐</h3>
            <p>Note moyenne</p>
        </div>
    `;

    if (progressEntries.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Aucune progression enregistrée</h3><p>Commencez à enregistrer vos performances</p></div>';
        return;
    }

    container.innerHTML = progressEntries.map(entry => {
        const date = new Date(entry.completed_at).toLocaleDateString('fr-FR');
        return `
            <div class="card">
                <h3>${entry.wod_name}</h3>
                <p><strong>Type:</strong> ${entry.wod_type}</p>
                <p><strong>Date:</strong> ${date}</p>
                ${entry.rounds_completed ? `<p><strong>Rounds:</strong> ${entry.rounds_completed}</p>` : ''}
                ${entry.time_seconds ? `<p><strong>Temps:</strong> ${Math.floor(entry.time_seconds / 60)}:${(entry.time_seconds % 60).toString().padStart(2, '0')}</p>` : ''}
                ${entry.rating ? `<p><strong>Note:</strong> ${'⭐'.repeat(entry.rating)}</p>` : ''}
                ${entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : ''}
                <div class="card-actions">
                    <button class="btn btn-danger" onclick="deleteProgress(${entry.id})">Supprimer</button>
                </div>
            </div>
        `;
    }).join('');
}

async function saveProgress(wodId, rounds, time, rating) {
    try {
        const progress = {
            wod_id: wodId,
            rounds_completed: rounds ? parseInt(rounds) : null,
            time_seconds: time ? parseInt(time) : null,
            rating: rating ? parseInt(rating) : null
        };

        await fetch(`${API_URL}/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(progress)
        });

        alert('Performance enregistrée !');
        await loadProgress();
    } catch (err) {
        console.error('Error saving progress:', err);
        alert('Erreur lors de l\'enregistrement');
    }
}

async function deleteProgress(id) {
    if (!confirm('Supprimer cette entrée de progression ?')) return;

    try {
        await fetch(`${API_URL}/progress/${id}`, { method: 'DELETE' });
        await loadProgress();
    } catch (err) {
        console.error('Error deleting progress:', err);
    }
}

// ==================== GENERATOR ====================

async function generateProgram() {
    const difficulty = document.getElementById('gen-difficulty').value;
    const duration = parseInt(document.getElementById('gen-duration').value);
    const goal = document.getElementById('gen-goal').value;

    if (!duration || duration < 1) {
        alert('Veuillez entrer une durée valide');
        return;
    }

    const confirmMsg = `Générer un programme ${difficulty} de ${duration} semaines pour ${goal || 'amélioration générale'} ?\n\nCela créera automatiquement ${duration * 5} WODs (5 par semaine).`;

    if (!confirm(confirmMsg)) return;

    try {
        document.getElementById('generator-tab').innerHTML += '<div class="loading"><h3>Génération en cours...</h3><p>Veuillez patienter</p></div>';

        const response = await fetch(`${API_URL}/programs/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty, duration_weeks: duration, goal })
        });

        if (response.ok) {
            const program = await response.json();
            alert(`Programme généré avec succès !\n\nNom: ${program.name}\nWODs créés: ${program.wods?.length || 0}\n\nConsultez l'onglet Programmes pour voir les détails.`);

            await loadPrograms();
            await loadWods();

            // Clear loading message
            location.reload();
        } else {
            const error = await response.json();
            alert('Erreur: ' + (error.error || 'Impossible de générer le programme'));
        }
    } catch (err) {
        console.error('Error generating program:', err);
        alert('Erreur lors de la génération du programme');
    }
}

// ==================== UTILITIES ====================

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
