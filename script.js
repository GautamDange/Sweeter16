const tabPrograms = document.getElementById('tabPrograms');
const tabInstructions = document.getElementById('tabInstructions');
const tabContent = document.getElementById('tabContent');

function flashElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Remove the class if already present
        element.classList.remove('highlight-flash');
        void element.offsetWidth; // Trigger reflow to restart animation
        element.classList.add('highlight-flash');
    }
}

function flashTopStackElement() {
    const stackDisplay = document.getElementById('stackDisplay');
    if (stackDisplay && stackDisplay.lastElementChild) {
        const topElement = stackDisplay.lastElementChild;

        // Force restart the animation
        topElement.classList.remove('stack-highlight-flash');
        void topElement.offsetWidth; // Trigger reflow to restart the animation
        topElement.classList.add('stack-highlight-flash');
    }
}



document.getElementById('stackDisplay').innerText = 'Updated stack contents...';
flashElement('stackDisplay');

document.getElementById('Convert').addEventListener('click', () => {
    const inputASM = document.getElementById('InputASM').value;
    if (!inputASM.trim()) {
        alert("Please provide an ASM program to convert.");
        return;
    }

    try {
        const assembledProgram = assemble(inputASM); // Convert ASM to JSON
        // Load the assembled program into the simulator
        loadProgram(assembledProgram);
    } catch (error) {
        alert(`Error during assembly: ${error.message}`);
    }
});


document.getElementById('RUN_NEXT').addEventListener('click', () => {
    executeNext(); 
});


function loadSamplePrograms() {
    import('./Sample_program.js').then(module => {
        tabContent.innerHTML = module.default.map(program => `
            <h3>${program.name}</h3>
            <pre><code>${program.code.trim()}</code></pre>
            <hr>
        `).join('');
    }).catch(err => {
        tabContent.innerHTML = `<p>Error loading sample programs: ${err.message}</p>`;
    });
}

function loadInstructionSet() {
    import('./Sample_instructions.js').then(module => {
        tabContent.innerHTML = module.default.map(instruction => `
            <h3>${instruction.name}</h3>
            <p><strong>Syntax:</strong> <code>${instruction.syntax}</code></p>
            <p><strong>Description:</strong> ${instruction.description}</p>
            <pre><code>${instruction.example}</code></pre>
            <hr>
        `).join('');
    }).catch(err => {
        tabContent.innerHTML = `<p>Error loading instruction set: ${err.message}</p>`;
    });
}

// Add event listeners to tabs
tabPrograms.addEventListener('click', () => {
    tabPrograms.classList.add('active');
    tabInstructions.classList.remove('active');
    loadSamplePrograms();
});

tabInstructions.addEventListener('click', () => {
    tabInstructions.classList.add('active');
    tabPrograms.classList.remove('active');
    loadInstructionSet();
});

loadSamplePrograms();
