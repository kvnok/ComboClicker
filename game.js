document.addEventListener('DOMContentLoaded', () => {
    const topElement = document.querySelector('#top');
	let activeBoxes = []; // Now an array to hold two active boxes
	let boxAmount = 5; // Number of boxes to activate
	// Initialize the game board
	function initializeGame() {
		for (let i = 0; i < 100; i++) { // Assuming a 10x10 grid
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
		while (activeBoxes.length < boxAmount) {
			const randomIndex = Math.floor(Math.random() * boxes.length);
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

/*
0-49
Blue
Slightly darker blue

50-99
Red
Slightly darker red

99- 149
Yellow
Slightly darker yellow

150-199
Green
Slightly darker green

200-249
Orange
Slightly darker orange

250-299
Purple
Slightly darker purple

300-349
Brown
Slightly darker brown

350-399
Pink
Slightly darker pink

400-449
Light blue
Slightly darker light blue

450-499
Light red
Slightly darker light red

500-549
Light yellow
Slightly darker light yellow

550-599
Light green
Slightly darker light green

600-649
Light orange
Slightly darker light orange

650-699
Light purple
Slightly darker light purple

700-749
Light brown
Slightly darker light brown

750-799
Light pink
Slightly darker light pink

800-inf
White
Slightly darker white
*/
