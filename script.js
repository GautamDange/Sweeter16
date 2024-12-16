// script.js

// Function to flash a UI element
function flashElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Remove the class if already present
        element.classList.remove('highlight-flash');
        void element.offsetWidth; // Trigger reflow to restart animation
        element.classList.add('highlight-flash');
    }
}

// Example Usage:
// When updating stack display
document.getElementById('stackDisplay').innerText = 'Updated stack contents...';
flashElement('stackDisplay');

// Link Convert button to assembler.js
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

// Link RUN_NEXT button to simulator.js
document.getElementById('RUN_NEXT').addEventListener('click', () => {
    executeNext(); // Assuming executeNext() is a global function from simulator.js
});

// Event listener for Sample Programs
document.getElementById('loadSamplePrograms').addEventListener('click', () => {
    import('./Sample_program.js').then(module => {
        const contentDisplay = document.getElementById('contentDisplay');
        contentDisplay.innerHTML = module.default.map(program => `
            <h3>${program.name}</h3>
            <pre><code>${program.code.trim()}</code></pre>
            <hr>
        `).join('');
    });
});

// Event listener for Instruction Set
document.getElementById('loadInstructionSet').addEventListener('click', () => {
    import('./Sample_instructions.js').then(module => {
        const contentDisplay = document.getElementById('contentDisplay');
        contentDisplay.innerHTML = module.default.map(instruction => `
            <h3>${instruction.name}</h3>
            <p><strong>Syntax:</strong> <code>${instruction.syntax}</code></p>
            <p><strong>Description:</strong> ${instruction.description}</p>
            <pre><code>${instruction.example}</code></pre>
            <hr>
        `).join('');
    });
});
