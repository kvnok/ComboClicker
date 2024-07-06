document.addEventListener('DOMContentLoaded', () => {
    const topElement = document.querySelector('#top');
	let activeBoxes = []; // Now an array to hold two active boxes

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
		while (activeBoxes.length < 5) {
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
			if (activeBoxes.length < 5) {
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
