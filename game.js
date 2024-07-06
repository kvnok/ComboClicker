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

function createGameGrid() {
    const gridContainer = document.getElementById('top'); // Targeting the game area
    gridContainer.innerHTML = ''; // Clear existing grid if any
    for (let i = 0; i < totalBoxes; i++) {
        const box = document.createElement('div');
        box.className = 'box';
        gridContainer.appendChild(box);
    }

    // Adjust grid dimensions based on gameBoxWidth and gameBoxHeight
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

let lastFrameTime = 0; // Track the last frame time for requestAnimationFrame

function startComboTimer(comboScore) {
    const currentRange = colorRanges.find(range => comboScore >= range.min && comboScore <= range.max);
    if (!currentRange) return; // If no range is found, exit the function

    let timeLeft = parseInt(currentRange.totaltime, 10); // Assuming totaltime is in milliseconds

    function timerFrame(currentTime) {
        if (!lastFrameTime) lastFrameTime = currentTime; // Initialize lastFrameTime during the first frame
        const deltaTime = currentTime - lastFrameTime; // Calculate the time difference in milliseconds

        timeLeft -= deltaTime; // Decrease timeLeft by the elapsed time since the last frame

        if (timeLeft <= 0) {
            const newRange = colorRanges.find(range => comboScore >= range.min && comboScore <= range.max);
            timeLeft = newRange ? parseInt(newRange.totaltime, 10) : 0; // Reset timeLeft or end the timer
            // Optionally, perform other actions when the timer would normally end
        }

        updateTimerDisplay(timeLeft); // Update UI with new timeLeft

        lastFrameTime = currentTime; // Update lastFrameTime to the current time

        if (timeLeft > 0) {
            requestAnimationFrame(timerFrame); // Request the next frame
        }
    }

    requestAnimationFrame(timerFrame); // Start the animation frame loop
}

function updateTimerDisplay(timeLeft) {
    const seconds = Math.max(timeLeft / 1000, 0).toFixed(2); // Convert timeLeft from milliseconds to seconds with two decimal places
    document.querySelector('#comboTimer h2').textContent = `${seconds} seconds`; // Update the comboTimer element with the new timeLeft
}

document.addEventListener('DOMContentLoaded', () => {
    const topElement = document.querySelector('#top');
    let activeBoxes = []; // Array to hold active boxes
    let boxAmount = 5; // Number of boxes to activate

    // Initialize the game board
    function initializeGame() {
        const gridContainer = document.getElementById('top');
        const totalBoxes = gameBoxWidth * gameBoxHeight;
        gridContainer.innerHTML = ''; // Clear existing grid if any
        for (let i = 0; i < totalBoxes; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            // Assuming box click event is set up here or elsewhere
        }
        // Start the combo timer with an initial score, adjust as needed
        startComboTimer(initialComboScore); // Ensure this is called to start the timer
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

    // Clear the current active boxes
    function clearActiveBoxes() {
        activeBoxes.forEach(box => box.style.backgroundColor = '');
        activeBoxes = [];
    }

    let clickCount = 0;

    topElement.addEventListener('click', (e) => {
        if (e.target.style.backgroundColor === 'black') {
            e.target.style.backgroundColor = '';
            activeBoxes = activeBoxes.filter(box => box !== e.target);
            clickCount++;
            document.querySelector('#comboText h2').textContent = clickCount;
            if (activeBoxes.length < boxAmount) {
                activateRandomBox();
            }
			startComboTimer(clickCount);
        }
    });

    let lastActivatedBox = null;

    function activateRandomBox() {
        const boxes = document.querySelectorAll('#top .box');
        let boxActivated = false;
        while (!boxActivated) {
            const randomIndex = Math.floor(Math.random() * boxes.length);
            if (!activeBoxes.includes(boxes[randomIndex]) && boxes[randomIndex] !== lastActivatedBox) {
                boxes[randomIndex].style.backgroundColor = 'black';
                activeBoxes.push(boxes[randomIndex]);
                lastActivatedBox = boxes[randomIndex];
                boxActivated = true;
            }
        }
    };
    initializeGame();
});
