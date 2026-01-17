const abacus = document.getElementById('abacus');

// --- ЗМІННІ ДЛЯ ЗВУКУ ---
const bgMusic = document.getElementById('bg-music');
const victorySound = document.getElementById('victory-sound');
const soundBtn = document.getElementById('sound-btn');
let isSoundOn = false;

// Налаштування гучності
bgMusic.volume = 0.3; // 30% гучності для фону
victorySound.volume = 0.8; // Гучніше для перемоги

// --- ФУНКЦІЯ ПЕРЕМИКАННЯ ЗВУКУ ---
soundBtn.addEventListener('click', toggleSound);

function toggleSound() {
    isSoundOn = !isSoundOn;
    
    if (isSoundOn) {
        bgMusic.play().catch(error => console.log("Автоплей заблоковано браузером"));
        soundBtn.innerText = "🎵"; // Іконка ноти
        soundBtn.classList.add('playing');
    } else {
        bgMusic.pause();
        soundBtn.innerText = "🔇"; // Іконка вимкненого звуку
        soundBtn.classList.remove('playing');
    }
}

const totalDisplay = document.getElementById('total-value');
const columnsCount = 7; 
let currentTarget = 0;
let totalPearls = 0;
let currentDifficulty = 4;

const ranks = [
    { threshold: 0, name: "Початківець" },
    { threshold: 10, name: "Матрос" },
    { threshold: 30, name: "Штурман" },
    { threshold: 70, name: "Капітан" },
    { threshold: 150, name: "Адмірал" },
    { threshold: 365, name: "Повелитель Океану" }
];

// Елементи перлини
const pearlContainer = document.getElementById('victory-pearl');
const flash = document.querySelector('.pearl-flash');

function initAbacus() {
    abacus.innerHTML = '';
    for (let i = 0; i < columnsCount; i++) {
        const colValue = Math.pow(10, columnsCount - 1 - i);
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.multiplier = colValue;

        const upper = document.createElement('div');
        upper.className = 'upper';
        createBead(upper, 5, true); 
        column.appendChild(upper);

        const lower = document.createElement('div');
        lower.className = 'lower';
        for (let j = 0; j < 4; j++) {
            createBead(lower, 1, false, j);
        }
        column.appendChild(lower);
        abacus.appendChild(column);
    }
}

function createBead(parent, value, isUpper, index = 0) {
    const bead = document.createElement('div');
    bead.className = 'bead';
    bead.dataset.value = value;
    bead.dataset.index = index;
    
    // Обробка кліку
    bead.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        handleBeadInteraction(bead, isUpper);
    }, { passive: false }); 
    
    // Обробка дотику
    bead.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        handleBeadInteraction(bead, isUpper);
    }, { passive: false });

    parent.appendChild(bead);
}

function handleBeadInteraction(beadElement, isUpper) {
    if (isUpper) {
        beadElement.classList.toggle('active');
    } else {
        const column = beadElement.closest('.column');
        const lowerBeads = Array.from(column.querySelectorAll('.lower .bead'));
        const clickedIndex = parseInt(beadElement.dataset.index);
        const isCurrentlyActive = beadElement.classList.contains('active');

        lowerBeads.forEach((b, idx) => {
            if (!isCurrentlyActive) {
                if (idx <= clickedIndex) b.classList.add('active');
            } else {
                if (idx >= clickedIndex) b.classList.remove('active');
            }
        });
    }
    calculateTotal();
}

function calculateTotal() {
    let total = 0;
    document.querySelectorAll('.column').forEach(col => {
        const multiplier = parseInt(col.dataset.multiplier);
        let colSum = 0;
        col.querySelectorAll('.bead.active').forEach(bead => {
            colSum += parseInt(bead.dataset.value);
        });
        total += colSum * multiplier;
    });
    totalDisplay.innerText = total.toLocaleString();

    // Перевірка перемоги
    if (currentTarget !== 0 && total === currentTarget) {
        showVictory();
    }
}

function showVictory() {
    const status = document.getElementById('mission-status');
    // Якщо вже показуємо перемогу - виходимо
    if (!pearlContainer.classList.contains('hidden')) return;

    status.innerText = "ПЕРЛИНУ ЗНАЙДЕНО!";
    
    pearlContainer.classList.remove('hidden');
    flash.classList.add('animate-flash');
    
    // Граємо звук тільки якщо користувач увімкнув його кнопкою
    if (isSoundOn) {
        victorySound.currentTime = 0; 
        victorySound.play().catch(e => console.log(e));
    }
    
    updateProgress();
    
    setTimeout(() => flash.classList.remove('animate-flash'), 800);
}

function updateProgress() {
    let reward = 1;
    if (currentDifficulty >= 5 && currentDifficulty <= 6) reward = 2;
    if (currentDifficulty === 7) reward = 3;
    
    totalPearls += reward;
    document.getElementById('pearls-total').innerText = totalPearls;
    
    const rankNameDisplay = document.getElementById('rank-name');
    const currentRank = [...ranks].reverse().find(r => totalPearls >= r.threshold);
    if (currentRank) {
        rankNameDisplay.innerText = currentRank.name;
    }
}

function resetAbacus() {
    document.querySelectorAll('.bead').forEach(bead => bead.classList.remove('active'));
    calculateTotal();
}

function generateMission() {
    // --- ПРИБРАНО АВТОМАТИЧНИЙ ЗАПУСК АУДІО ТУТ ---
    
    const select = document.getElementById('digit-select');
    let digits = parseInt(select.value);
    
    if (digits === 8) {
        digits = Math.floor(Math.random() * 6) + 2;
    }
    
    currentDifficulty = digits;
    
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    
    currentTarget = Math.floor(Math.random() * (max - min + 1)) + min;
    
    document.getElementById('target-number').innerText = "Ціль: " + currentTarget;
    document.getElementById('mission-status').innerText = "Занурення...";
    document.getElementById('mission-status').style.color = "#888";
    
    pearlContainer.classList.add('hidden');
    resetAbacus();
}

function createBackgroundBubbles() {
    const container = document.body;
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.style.position = 'absolute';
        bubble.style.bottom = '-20px';
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.width = bubble.style.height = Math.random() * 10 + 5 + 'px';
        bubble.style.background = 'rgba(255, 255, 255, 0.1)';
        bubble.style.borderRadius = '50%';
        bubble.style.pointerEvents = 'none';
        bubble.style.zIndex = '-1';
        
        const duration = Math.random() * 10 + 5;
        bubble.animate([
            { transform: 'translateY(0) translateX(0)', opacity: 0.5 },
            { transform: `translateY(-110vh) translateX(${Math.random() * 50 - 25}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            delay: Math.random() * 5000
        });
        container.appendChild(bubble);
    }
}

createBackgroundBubbles();
initAbacus();