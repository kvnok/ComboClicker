// Simulated CSV content as a string
const csvContent = `min,max,top,bottom,timer
0,1,#0000FF,#0000CC,6000
2,3,#FF0000,#CC0000,5500
4,5,#FFFF00,#CCCC00,5000
6,7,#00FF00,#00CC00,4500
8,9,#FFA500,#CC8400,4000
10,11,#800080,#660066,3500
12,13,#A52A2A,#802020,3000
14,15,#FFC0CB,#CC8085,2500
16,17,#ADD8E6,#87AFC1,2000
18,19,#FF7F7F,#CC6666,1500
20,21,#FFFFE0,#CCCCB3,1000
22,23,#90EE90,#77CC77,500
24,25,#FFD700,#CCA300,300
26,27,#E6E6FA,#B3B3D9,200
28,29,#CD853F,#A67A3E,100
30,31,#FFB6C1,#CC8C99,50
32,9999999,#FFFFFF,#CCCCCC,20`;

const gameBoxWidth = 30; // Example width, adjust as needed
const gameBoxHeight = 10; // Example height, adjust as needed
const totalBoxes = gameBoxWidth * gameBoxHeight;
let initialComboScore = 0; // Initial combo score, adjust as needed
let highScore = 0; // Variable to keep track of high score
let gameStarted = false; // Flag to track if the game has started

function createGameGrid() {
    const gridContainer = document.getElementById('top');
    gridContainer.innerHTML = '';
    for (let i = 0; i < totalBoxes; i++) {
        const box = document.createElement('div');
        box.className = 'box';
        gridContainer.appendChild(box);
    }

    gridContainer.style.gridTemplateColumns = `repeat(${gameBoxWidth}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gameBoxHeight}, 1fr)`;
}

createGameGrid();

// Parse the CSV content
const colorRanges = csvContent.split('\n').slice(1).map(line => {
    const [min, max, top, bottom, totaltime] = line.split(',');
    return { min: parseInt(min, 10), max: parseInt(max, 10), top, bottom, totaltime };
});

function updateBackgroundColors(comboScore) {
    const currentRange = colorRanges.find(range => comboScore >= range.min && comboScore <= range.max);
    
    if (currentRange) {
        document.querySelector('#top').style.backgroundColor = currentRange.top;
        document.querySelector('#bottom').style.backgroundColor = currentRange.bottom;
    }
}

let lastFrameTime = null; // Track the last frame time for requestAnimationFrame
let timerId = null; // Track the current timer

function startComboTimer(comboScore) {
    const currentRange = colorRanges.find(range => comboScore >= range.min && comboScore <= range.max);
    if (!currentRange) return;

    let timeLeft = parseInt(currentRange.totaltime, 10);

    if (timerId) {
        cancelAnimationFrame(timerId); // Cancel any existing timer
    }
    lastFrameTime = null; // Reset last frame time

    function timerFrame(currentTime) {
        if (!lastFrameTime) lastFrameTime = currentTime;
        const deltaTime = currentTime - lastFrameTime;

        timeLeft -= deltaTime;

        if (timeLeft <= 0) {
            timeLeft = 0;

            // Check and update high score
            if (initialComboScore > highScore) {
                highScore = initialComboScore;
                document.querySelector('#highscore h2').textContent = highScore;
            }

            // Reset score and timer
            initialComboScore = 0;
            document.querySelector('#comboText h2').textContent = initialComboScore;
            updateBackgroundColors(initialComboScore);
            gameStarted = false; // Reset the game start flag
            activateRandomBoxes(); // Activate initial set of random boxes

            return; // Exit the timer frame function
        }

        updateTimerDisplay(timeLeft);
        lastFrameTime = currentTime;

        if (timeLeft > 0) {
            timerId = requestAnimationFrame(timerFrame);
        }
    }

    timerId = requestAnimationFrame(timerFrame);
}

function updateTimerDisplay(timeLeft) {
    const seconds = Math.max(timeLeft / 1000, 0).toFixed(2);
    document.querySelector('#comboTimer h2').textContent = `${seconds} seconds`;
}

document.addEventListener('DOMContentLoaded', () => {
    createGameGrid();
    initializeGame();
    updateBackgroundColors(initialComboScore); // Initial background color update
});

function initializeGame() {
    const gridContainer = document.getElementById('top');
    const totalBoxes = gameBoxWidth * gameBoxHeight;
    gridContainer.innerHTML = '';
    for (let i = 0; i < totalBoxes; i++) {
        const box = document.createElement('div');
        box.className = 'box';
        gridContainer.appendChild(box);
    }
    activateRandomBoxes(); // Activate initial set of random boxes
}

// Activate random boxes
function activateRandomBoxes() {
    const boxes = document.querySelectorAll('#top .box');
    clearActiveBoxes();
    while (activeBoxes.length < boxAmount) {
        const randomIndex = Math.floor(Math.random() * boxes.length);
        if (!activeBoxes.includes(boxes[randomIndex])) {
            boxes[randomIndex].style.backgroundColor = 'black';
            activeBoxes.push(boxes[randomIndex]);
        }
    }
}

function clearActiveBoxes() {
    activeBoxes.forEach(box => box.style.backgroundColor = '');
    activeBoxes = [];
}

let activeBoxes = []; // Array to hold active boxes
let boxAmount = 5; // Number of boxes to activate

const topElement = document.querySelector('#top');
topElement.addEventListener('click', (e) => {
    if (e.target.style.backgroundColor === 'black') {
        e.target.style.backgroundColor = '';
        activeBoxes = activeBoxes.filter(box => box !== e.target);
        initialComboScore++;
        document.querySelector('#comboText h2').textContent = initialComboScore;
        updateBackgroundColors(initialComboScore); // Update background colors on score change
        if (activeBoxes.length < boxAmount) {
            activateRandomBox();
        }
        if (!gameStarted) {
            gameStarted = true;
            startComboTimer(initialComboScore);
        }
    }
});

function activateRandomBox() {
    const boxes = document.querySelectorAll('#top .box');
    let boxActivated = false;
    while (!boxActivated) {
        const randomIndex = Math.floor(Math.random() * boxes.length);
        if (!activeBoxes.includes(boxes[randomIndex]) && boxes[randomIndex].style.backgroundColor !== 'black') {
            boxes[randomIndex].style.backgroundColor = 'black';
            activeBoxes.push(boxes[randomIndex]);
            boxActivated = true;
        }
    }
}
