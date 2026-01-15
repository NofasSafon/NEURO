// Код залишається схожим за логікою, але ми додаємо 7 стовпчиків для масштабності
const abacus = document.getElementById('abacus');
const totalDisplay = document.getElementById('total-value');
const columnsCount = 7; 

for (let i = 0; i < columnsCount; i++) {
    const colValue = Math.pow(10, columnsCount - 1 - i);
    const column = document.createElement('div');
    column.className = 'column';
    column.dataset.multiplier = colValue;

    const upper = document.createElement('div');
    upper.className = 'upper';
    createBead(upper, 5);
    column.appendChild(upper);

    const lower = document.createElement('div');
    lower.className = 'lower';
    for (let j = 0; j < 4; j++) {
        createBead(lower, 1);
    }
    column.appendChild(lower);

    abacus.appendChild(column);
}

function createBead(parent, value) {
    const bead = document.createElement('div');
    bead.className = 'bead';
    bead.dataset.value = value;
    bead.onclick = function() {
        this.classList.toggle('active');
        // Тут можна додати: new Audio('click.mp3').play();
        calculateTotal();
    };
    parent.appendChild(bead);
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
    
    // Ефект "набору енергії" - швидка зміна цифр
    totalDisplay.innerText = total.toLocaleString();
}
let currentTarget = 0;

function generateMission() {
    // Генеруємо число від 1 до 999
    currentTarget = Math.floor(Math.random() * 999) + 1;
    document.getElementById('target-number').innerText = currentTarget;
    document.getElementById('mission-status').innerText = "Кординати отримано! Налаштуй абак...";
    document.getElementById('mission-status').classList.remove('status-success');
    calculateTotal(); // Скидаємо перевірку
}

// Онови функцію calculateTotal, додавши в кінці:
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

    // ПЕРЕВІРКА МІСІЇ
    const status = document.getElementById('mission-status');
    if (total === currentTarget && currentTarget !== 0) {
        status.innerText = "МІСІЯ ВИКОНАНА! Шлях вільний! 🚀";
        status.classList.add('status-success');
    }
}