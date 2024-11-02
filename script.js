let selectedNumber = null;
let additionalOption = null;
let selectedButton = null;
let finalOption = null;
let labelInput = '';
let savedSelections = [];

// Handle button selection in Step 1
function selectButton(buttonNumber) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));

    const selectedBtn = buttons[buttonNumber - 1];
    selectedBtn.classList.add('selected');
    selectedButton = buttonNumber;

    populateNumberDropdown(buttonNumber);
}

// Populate the number dropdown based on selected section
function populateNumberDropdown(buttonNumber) {
    const numberDropdown = document.getElementById('numberDropdown');
    numberDropdown.innerHTML = ''; // Clear existing options

    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select a number';
    defaultOption.value = '';
    numberDropdown.appendChild(defaultOption);

    let options = [];
    if (buttonNumber === 1) options = Array.from({ length: 14 }, (_, i) => i + 1);
    else if (buttonNumber === 2) options = Array.from({ length: 10 }, (_, i) => i + 1);
    else if (buttonNumber === 3) options = Array.from({ length: 5 }, (_, i) => i + 1);

    options.forEach(num => {
        const option = document.createElement('option');
        option.value = num;
        option.textContent = num;
        numberDropdown.appendChild(option);
    });

    numberDropdown.onchange = () => {
        selectedNumber = numberDropdown.value;
        if (selectedNumber) {
            goToStep('step3');
        }
    };
}

// Populate the additional dropdown based on selected section
function populateAdditionalDropdown() {
    const additionalDropdown = document.getElementById('additionalDropdown');
    additionalDropdown.innerHTML = ''; // Clear existing options

    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select an option';
    defaultOption.value = '';
    additionalDropdown.appendChild(defaultOption);

    let options = [];
    if (selectedButton) options = Array.from({ length: 14 }, (_, i) => i + 1);

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        additionalDropdown.appendChild(opt);
    });

    additionalDropdown.onchange = () => {
        additionalOption = additionalDropdown.value;
        if (additionalOption) {
            goToStep('step4');
        }
    };
}

// Handle option selection in Step 4
function selectOption(option) {
    finalOption = option;
    goToStep('step5');
}

// Transition between steps
function goToStep(stepId) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.style.display = 'none');

    document.getElementById(stepId).style.display = 'block';

    if (stepId === 'step2') {
        populateNumberDropdown(selectedButton);
    } else if (stepId === 'step3') {
        populateAdditionalDropdown();
    } else if (stepId === 'step5') {
        document.getElementById('labelInput').value = ''; // Reset label input field
    } else if (stepId === 'step6') {
        displayFinalChoices();
    }
}

// Prepare the final choice with the label input
function prepareFinalChoice() {
    labelInput = document.getElementById('labelInput').value.trim();
    return {
        text: `TIRE: ${selectedButton}. FLOOR: ${selectedNumber}. SHELF: ${additionalOption}.${finalOption}`,
        labelInput: labelInput, // Store the label input separately
        done: false
    };
}

// Display final choices for confirmation
function displayFinalChoices() {
    const finalChoiceContainer = document.getElementById('finalChoice');
    finalChoiceContainer.innerHTML = ''; // Clear previous content

    const finalSelection = prepareFinalChoice();
    const stepsLine = `TIRE: ${selectedButton}. FLOOR: ${selectedNumber}. SHELF: ${additionalOption}.${finalOption}`;
    const labelLine = `Book Code: ${labelInput}`;

    finalChoiceContainer.innerHTML = `
        <div class="final-steps">${stepsLine}</div>
        <div class="final-label">${labelLine}</div>
    `;
}

// Save the current selection
function saveSelection() {
    if (savedSelections.length >= 6) {
        openModal();
        return;
    }

    const selection = prepareFinalChoice();
    savedSelections.push(selection);
    localStorage.setItem('userSelections', JSON.stringify(savedSelections));
    displaySavedSelections();

    resetSteps();
}

// Display all saved selections
function displaySavedSelections() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    savedSelections.forEach((selection, index) => {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'saved-label';

        const stepsLine = selection.text; // Access the text directly
        const labelLine = `Book Code: ${selection.labelInput}`; // Use the stored labelInput

        const label = document.createElement('div');
        label.innerHTML = `<div>${stepsLine}</div><div>${labelLine}</div>`;
        if (selection.done) {
            label.style.textDecoration = "line-through";
        }

        const doneButton = document.createElement('button');
        doneButton.innerHTML = `<i class="fas fa-check"></i> DONE`;
        doneButton.onclick = () => markDone(index);

        const delButton = document.createElement('button');
        delButton.innerHTML = `<i class="fas fa-trash"></i> DEL`;
        delButton.onclick = () => deleteSelection(index);

        labelDiv.appendChild(label);
        labelDiv.appendChild(doneButton);
        labelDiv.appendChild(delButton);

        resultsContainer.appendChild(labelDiv);
    });
}

// Mark a selection as done
function markDone(index) {
    // Toggle the done status safely
    if (savedSelections[index]) {
        savedSelections[index].done = !savedSelections[index].done; // Toggle the done status
        displaySavedSelections(); // Refresh the display
    }
}

// Delete a saved selection
function deleteSelection(index) {
    // Check if the index is valid before deleting
    if (index >= 0 && index < savedSelections.length) {
        savedSelections.splice(index, 1); // Remove the selection at the index
        localStorage.setItem('userSelections', JSON.stringify(savedSelections)); // Update local storage
        displaySavedSelections(); // Refresh the display
    }
}

// Open modal for maximum selections
function openModal() {
    document.getElementById('modal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Reset steps for new selection
function resetSteps() {
    selectedNumber = null;
    additionalOption = null;
    selectedButton = null;
    finalOption = null;
    labelInput = ''; // Reset label input
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.style.display = 'none');
    goToStep('step1'); // Reset to first step
}

// Load previous selections on page load
window.onload = function() {
    const savedSelection = localStorage.getItem('userSelections');
    if (savedSelection) {
        savedSelections = JSON.parse(savedSelection);
        console.log('Loaded saved selections:', savedSelections); // Log loaded selections
        displaySavedSelections();
    }
};
