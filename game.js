// Simulated CSV content as a string
const csvContent = `min,max,top,bottom,timer
0,24,#FFC0CB,#CC8085,4000
25,49,#ADD8E6,#87AFC1,3500
50,74,#FF7F7F,#CC6666,3000
75,99,#FFFFE0,#CCCCB3,2500
100,124,#90EE90,#77CC77,2000
125,149,#FFD700,#CCA300,1500
150,174,#E6E6FA,#B3B3D9,1000
175,199,#CD853F,#A67A3E,900
200,224,#FFC0CB,#CC8085,800
225,249,#ADD8E6,#87AFC1,700
250,274,#FF7F7F,#CC6666,600
275,299,#FFFFE0,#CCCCB3,500
300,324,#90EE90,#77CC77,400
325,349,#FFD700,#CCA300,300
350,374,#E6E6FA,#B3B3D9,200
375,399,#CD853F,#A67A3E,200
400,9999999,#FFFFFF,#CCCCCC,100`;

const gameBoxWidth = 20; // Example width, adjust as needed
const gameBoxHeight = 10; // Example height, adjust as needed
const totalBoxes = gameBoxWidth * gameBoxHeight;
let initialComboScore = 0; // Initial combo score, adjust as needed
let highScore = 0; // Variable to keep track of high score
let gameStarted = false; // Flag to track if the game has started
let activeBoxes = []; // Array to hold active boxes
let boxAmount = 5; // Number of boxes to activate

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

function remove_old_active_boxes() {
	for (let i = activeBoxes.length - 1; i >= 0; i--) {
		if (activeBoxes[i].style.backgroundColor !== 'black') {
			activeBoxes[i].style.backgroundColor = ''; // Reset background color
			activeBoxes.splice(i, 1); // Remove element from array
		}
	}
}

function updateBackgroundColors(comboScore) {
    const currentRange = colorRanges.find(range => comboScore >= range.min && comboScore <= range.max);
    
    if (currentRange) {
        document.querySelector('#top').style.backgroundColor = currentRange.top;
        document.querySelector('#bottom').style.backgroundColor = currentRange.bottom;
    }
	remove_old_active_boxes();
}

let lastFrameTime = null; // Track the last frame time for requestAnimationFrame
let timerId = null; // Track the current timer

let timeLeft = 0; // Time left in the timer

function startComboTimer(comboScore) {
    const currentRange = colorRanges.find(range => comboScore >= range.min && comboScore <= range.max);
    if (!currentRange) return;

    timeLeft = parseInt(currentRange.totaltime, 10);

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
			remove_old_active_boxes();
            timerId = requestAnimationFrame(timerFrame);
        }
    }

    timerId = requestAnimationFrame(timerFrame);
}

function updateTimerDisplay(timeLeft) {
    // const seconds = Math.max(timeLeft / 1000, 0).toFixed(2);
    // document.querySelector('#comboTimer h2').textContent = `${seconds}`;
	const totalTime = parseInt(colorRanges.find(range => initialComboScore >= range.min && initialComboScore <= range.max).totaltime, 10);
    const percentageLeft = (timeLeft / totalTime) * 100;
    document.querySelector('.progress-bar').style.width = `${percentageLeft}%`;
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

function activateRandomBoxes() {
    const boxes = document.querySelectorAll('#top .box');
	const cols = gameBoxWidth;
    const rows = gameBoxHeight;
	clearActiveBoxes();
    while (activeBoxes.length < boxAmount) {
		let randi = Math.floor(Math.random() * boxes.length);
		while (
			randi >= 0 && randi <= cols ||
			randi >= (cols * (rows - 1)) && randi <= (cols * rows - 1) ||
			randi % cols === 0 || randi % cols === cols - 1 ||
			(boxes[randi] && boxes[randi].style.backgroundColor === 'black') ||
			(boxes[randi-1] && boxes[randi-1].style.backgroundColor === 'black') ||
			(boxes[randi+1] && boxes[randi+1].style.backgroundColor === 'black') ||
			(boxes[randi-cols] && boxes[randi-cols].style.backgroundColor === 'black') ||
			(boxes[randi+cols] && boxes[randi+cols].style.backgroundColor === 'black')
		) {
			randi = Math.floor(Math.random() * boxes.length);
		}
		if (boxes[randi]) { // Check if boxes[randi] is not undefined
			boxes[randi].style.backgroundColor = 'black';
			activeBoxes.push(boxes[randi]);
		}
	}
}

function clearActiveBoxes() {
    activeBoxes.forEach(box => box.style.backgroundColor = '');
    activeBoxes = [];
}

const topElement = document.querySelector('#top');
topElement.addEventListener('mousedown', (e) => {
    if (e.target.style.backgroundColor === 'black') {
        const clickSound = new Audio('tap.wav');
        clickSound.play();
		const currentRange = colorRanges.find(range => initialComboScore >= range.min && initialComboScore <= range.max);
		timeLeft = parseInt(currentRange.totaltime, 10); // Reset the timer
        e.target.style.backgroundColor = '';
        const boxesArray = Array.from(document.querySelectorAll('.box'));
		const clickedBoxIndex = boxesArray.indexOf(e.target);
		activeBoxes = activeBoxes.filter(box => box !== e.target);
        initialComboScore++;
        document.querySelector('#comboText h2').textContent = initialComboScore;
        updateBackgroundColors(initialComboScore); // Update background colors on score change
        if (activeBoxes.length < boxAmount) {
			remove_old_active_boxes();
            activateRandomBox(clickedBoxIndex);
        }
        if (!gameStarted) {
            gameStarted = true;
            startComboTimer(initialComboScore);
        }
    }
});

function activateRandomBox(clickedIndex) {
	const boxes = document.querySelectorAll('#top .box');
	if (boxes.length === 0) return; // Ensure there are boxes to activate

	const rows = gameBoxHeight;
	const cols = gameBoxWidth;
	let boxActivated = false;

	while (!boxActivated) {
		remove_old_active_boxes();
		const randomRow = Math.floor(Math.random() * (rows - 2)) + 1; // Avoid first and last row
		const randomCol = Math.floor(Math.random() * (cols - 2)) + 1; // Avoid first and last column
		let randi = randomRow * cols + randomCol;
		// Ensure randi is within the bounds of the boxes array
		randi = randi % boxes.length; 

		while (
			boxes[randi] && ( // Check if boxes[randi] is defined
				boxes[randi].style.backgroundColor === 'black' ||
				boxes[randi-1]?.style.backgroundColor === 'black' || // Use optional chaining to avoid undefined
				boxes[randi+1]?.style.backgroundColor === 'black' ||
				boxes[randi-cols]?.style.backgroundColor === 'black' ||
				boxes[randi+cols]?.style.backgroundColor === 'black' ||
				randi >= 0 && randi <= cols ||
				randi >= (cols * (rows - 1)) && randi <= (cols * rows - 1) ||
				randi % cols === 0 || randi % cols === cols - 1 || randi === clickedIndex
			)
		) {
			randi = Math.floor(Math.random() * boxes.length);
		}
		if (boxes[randi]) { // Additional check to ensure boxes[randi] is defined
			boxes[randi].style.backgroundColor = 'black';
			activeBoxes.push(boxes[randi]);
			boxActivated = true;
		}
	}
}

