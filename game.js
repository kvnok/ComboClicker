// Simulated CSV content as a string
const csvContent = `min,max,top,bottom
0,1,#0000FF,#0000CC
2,3,#FF0000,#CC0000
4,5,#FFFF00,#CCCC00
6,7,#00FF00,#00CC00
8,9,#FFA500,#CC8400
10,11,#800080,#660066
12,13,#A52A2A,#802020
14,15,#FFC0CB,#CC8085
16,17,#ADD8E6,#87AFC1
18,19,#FF7F7F,#CC6666
20,21,#FFFFE0,#CCCCB3
22,23,#90EE90,#77CC77
24,25,#FFD700,#CCA300
26,27,#E6E6FA,#B3B3D9
28,29,#CD853F,#A67A3E
30,31,#FFB6C1,#CC8C99
32,9999999,#FFFFFF,#CCCCCC`;

const gameBoxWidth = 20; // Example width, adjust as needed
const gameBoxHeight = 10; // Example height, adjust as needed

function createGameGrid() {
    const gridContainer = document.getElementById('top'); // Targeting the game area
    gridContainer.innerHTML = ''; // Clear existing grid if any
    const totalBoxes = gameBoxWidth * gameBoxHeight;

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
    const [min, max, top, bottom] = line.split(',');
    return { min: parseInt(min, 10), max: parseInt(max, 10), top, bottom };
});

function updateBackgroundColors(comboScore) {
    const currentRange = colorRanges.find(range => comboScore >= range.min && comboScore <= range.max);
    
    if (currentRange) {
        document.querySelector('#top').style.backgroundColor = currentRange.top;
        document.querySelector('#bottom').style.backgroundColor = currentRange.bottom;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const topElement = document.querySelector('#top');
	let activeBoxes = []; // Now an array to hold two active boxes
	let boxAmount = 5; // Number of boxes to activate
	// Initialize the game board
	function initializeGame() {
		for (let i = 0; i < 100; i++) {
			const box = document.createElement('div');
			box.classList.add('box');
			topElement.appendChild(box);
		}
		activateRandomBoxes(); // Now activating two boxes
	}

	// Activate two random boxes
	function activateRandomBoxes() {
		const boxes = document.querySelectorAll('#top .box');
		clearActiveBoxes(); // Clear current active boxes first
		const gridWidth = 5; // Assuming a grid width of n boxes
		const selectableBoxesCount = boxes.length - gridWidth; // Exclude the outer right column

		while (activeBoxes.length < boxAmount) {
			// Adjust randomIndex to exclude the outer right boxes
			const randomIndex = Math.floor(Math.random() * selectableBoxesCount);
			if (!activeBoxes.includes(boxes[randomIndex])) { // Ensure unique boxes are activated
				boxes[randomIndex].style.backgroundColor = 'black';
				activeBoxes.push(boxes[randomIndex]);
			}
		}
	}

	// Clear the current active boxes
	function clearActiveBoxes() {
		activeBoxes.forEach(box => box.style.backgroundColor = ''); // Reset to default or specify a color
		activeBoxes = []; // Reset the active boxes array
	}

	let clickCount = 0; // Step 1: Initialize click counter

	// Assuming the existing event listener for box clicks
	topElement.addEventListener('click', (e) => {
		if (e.target.style.backgroundColor === 'black') {
			e.target.style.backgroundColor = ''; // Reset clicked box
			activeBoxes = activeBoxes.filter(box => box !== e.target); // Remove clicked box from activeBoxes

			clickCount++; // Step 2: Increment click counter
			document.querySelector('#comboText h2').textContent = clickCount; // Step 3: Update comboText display
			updateBackgroundColors(clickCount); // Step 4: Update background colors based on combo score
			// Activate new box if less than two are active
			if (activeBoxes.length < boxAmount) {
				activateRandomBox();
			}
		}
	});

	let lastActivatedBox = null; // Track the last activated box

	function activateRandomBox() {
		const boxes = document.querySelectorAll('#top .box');
		let boxActivated = false;
		while (!boxActivated) {
			const randomIndex = Math.floor(Math.random() * boxes.length);
			if (!activeBoxes.includes(boxes[randomIndex]) && boxes[randomIndex] !== lastActivatedBox) {
				boxes[randomIndex].style.backgroundColor = 'black';
				activeBoxes.push(boxes[randomIndex]);
				lastActivatedBox = boxes[randomIndex]; // Update the last activated box
				boxActivated = true;
			}
		}
	};
	initializeGame();
});
