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


//document.getElementById('stackDisplay').innerText = 'Updated stack contents...';


document.getElementById('Convert').addEventListener('click', () => {
    const inputASM = document.getElementById('InputASM').value;
    if (!inputASM.trim()) {
        alert("Please provide an ASM program to convert.");
        return;
    }

    try {
        const assembledProgram = assemble(inputASM); // Convert ASM to JSON
        loadProgram(assembledProgram);
    } catch (error) {
        alert(`Error during assembly: ${error.message}`);
    }

    disableConvertButton();

    // ✅ SHOW "RUN NEXT" & "RESET" BUTTONS AFTER CONVERT CLICK
    document.getElementById('RUN_NEXT').style.display = 'inline-block';
    document.getElementById('RESET').style.display = 'inline-block';

    // ❌ HIDE "CONVERT" BUTTON AFTER CLICK
    document.getElementById('Convert').style.display = 'none';
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

document.getElementById('tabManual').addEventListener('click', () => {
    document.getElementById('tabManual').classList.add('active');
    document.getElementById('tabPrograms').classList.remove('active');
    document.getElementById('tabInstructions').classList.remove('active');

    // Convert Markdown-style text to HTML with headers and line breaks
    const formattedManual = UserManual
        .replace(/## (.*?)\n/g, "<h2>$1</h2>\n")  // Convert ## to <h2>
        .replace(/# (.*?)\n/g, "<h1>$1</h1>\n")   // Convert # to <h1>
        .replace(/\n/g, "<br>");                  // Convert remaining new lines to <br>

    document.getElementById('tabContent').innerHTML = formattedManual;
});


loadSamplePrograms();

function disableConvertButton() 
{
    const button = document.getElementById('Convert');
    button.disabled = true; // Disable the button
    button.innerText = " Converted "; // Optionally change the button text
    flashButton('RUN_NEXT'); // Add flashing animation to RUN_NEXT button
}


function flashButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return; // Exit if the button doesn't exist

    // Add the highlight-flash class to start the animation
    button.classList.add('highlight-flash');

    // Remove the class after the animation finishes (5 cycles * 1s = 5 seconds)
    setTimeout(() => {
        button.classList.remove('highlight-flash');
    }, 5000); // Adjust the timeout duration to match the animation time
}

// Call the function to flash the RUN_NEXT button
flashButton('Convert');


document.addEventListener("DOMContentLoaded", () => {
    const manualButton = document.getElementById("tabManual");

    if (manualButton) {
        // Add the blinking effect
        manualButton.classList.add("blink");

        // Stop blinking after 5 seconds
        setTimeout(() => {
            manualButton.classList.remove("blink");
        }, 5000);
    } else {
        console.error("tabManual button not found! Check if the ID is correct in index.html.");
    }
});
