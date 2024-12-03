// Memory size and layout setup
const MEMORY_SIZE = 0xE000; // Program memory up to DFFFFH
const STACK_START = 0xE000; // Stack starts at E000H
const STACK_END = 0xFFFF;   // Stack ends at FFFFH
const memory = new Uint16Array((MEMORY_SIZE + (STACK_END - STACK_START + 1)) / 2); // Adjusted memory size
const registers = new Uint16Array(8); // 8 registers (R0 to R7)
let instructionPointer = 0x0000; // Program Counter (IP) starts at 0x0000
let stackPointer = STACK_END; // Stack Pointer (SP) starts at 0xFFFF
let program = []; // ASM program

// Define instruction set
const instructions = {
    "LDL": (rd, val) => { registers[rd] = val; },
    "ADD": (rd, rs, rt) => { registers[rd] = registers[rs] + registers[rt]; },
    "SUB": (rd, rs, rt) => { registers[rd] = registers[rs] - registers[rt]; },
    "JNZ": (rd, address) => {
        if (registers[rd] !== 0) {
            instructionPointer = address;
        }
    },
    "JMP": (address) => { instructionPointer = address; },
    "PSH": (rs) => {
        if (stackPointer <= STACK_START) {
            alert("Stack Overflow!");
            return;
        }
        memory[stackPointer] = registers[rs];
        stackPointer--;  // Decrement after writing the value
    },
    "POP": (rd) => {
        if (stackPointer >= STACK_END) {
            alert("Stack Underflow!");
            return;
        }
        stackPointer++;  // Increment before reading
        if (stackPointer > STACK_END) {
            alert("Stack Overflow!");
            return;
        }
        registers[rd] = memory[stackPointer];
    },
    "RTS": () => {
        if (stackPointer >= STACK_END) {
            alert("Stack Underflow!");
            return;
        }
        stackPointer++;  // Increment before reading
        if (stackPointer > STACK_END) {
            alert("Stack Overflow!");
            return;
        }
        instructionPointer = memory[stackPointer];
    }
};

// Load a sample program into memory
function loadProgram(assembledProgram) {
    if (!assembledProgram || assembledProgram.length === 0) {
        alert("No program to load. Please convert an ASM program first.");
        return;
    }

    program = assembledProgram; // Use the dynamically assembled program

    // Load instructions into memory starting from 0x0000
    let address = 0x0000;
    program.forEach((inst, index) => {
        memory[address++] = index; // Storing line numbers (just as placeholder)
    });

    // Display program in ASM view
    const programDisplay = document.getElementById('InMemoryProgram');
    programDisplay.value = program.map((inst, index) =>
        `${index.toString(16).padStart(4, '0')}: ${inst.op} ${inst.args.join(', ')}`
    ).join('\n');
}




// Display register values
function updateRegisterDisplay() {
    const registerDisplay = document.getElementById('registerDisplay');
    registerDisplay.innerHTML = `
        <span>R0: ${registers[0]}</span><span>R1: ${registers[1]}</span>
        <span>R2: ${registers[2]}</span><span>R3: ${registers[3]}</span><br>
        <span>R4: ${registers[4]}</span><span>R5: ${registers[5]}</span>
        <span>R6: ${registers[6]}</span><span>R7: ${registers[7]}</span>
    `;
}

// Display memory contents, highlighting IP and SP
function updateMemoryDisplay() {
    const programDisplay = document.getElementById('InMemoryProgram');
    const stackDisplay = document.getElementById('stackDisplay');
    
    // Update program memory
    const displayRange = program.length; // Adjust to program size
    let programContent = '';

    for (let i = 0; i < displayRange; i++) {
        const address = i.toString(16).padStart(4, '0').toUpperCase();
        const instruction = program[i];
        let line = `${address}: ${instruction?.op || ''} ${instruction?.args?.join(', ') || ''}`;

        // Highlight the current instruction pointer (IP)
        if (i === instructionPointer) {
            line = `[IP] ${line}`;
        }

        programContent += line + '\n';
    }

    programDisplay.value = programContent.trim();

    // Update stack memory
    let stackContent = '';
    for (let i = STACK_END; i >= STACK_END - 15; i--) {
        const value = memory[i] || '0000'; // Default to 0000 if no value is present
        const line = `0x${i.toString(16).toUpperCase().padStart(4, '0')}: ${value}`;
        stackContent += line + '\n';
    }

    stackDisplay.value = stackContent.trim();
}




// Display control panel values (IP, SP)
function updateControlPanel() {
    document.getElementById('ipDisplay').textContent = `0x${instructionPointer.toString(16).padStart(4, '0').toUpperCase()}`;
    document.getElementById('spDisplay').textContent = `0x${stackPointer.toString(16).padStart(4, '0').toUpperCase()}`;
}

// Execute the next instruction in the program
function executeNext() {
    if (instructionPointer >= program.length) {
        alert("End of Program");
        return;
    }

    const { op, args } = program[instructionPointer++];
    if (instructions[op]) {
        instructions[op](...args);
    }

    // Highlight the instruction being executed in the InMemoryProgram textarea
    const memoryTextarea = document.getElementById('InMemoryProgram');
    const memoryLines = memoryTextarea.value.split('\n');
    const newMemoryContent = memoryLines.map((line, index) => {
        const address = index.toString(16).padStart(4, '0').toUpperCase();
        return instructionPointer - 1 === index
            ? `[IP] ${address}: ${program[index]?.op || ''} ${program[index]?.args?.join(', ') || ''}`
            : `${address}: ${program[index]?.op || ''} ${program[index]?.args?.join(', ') || ''}`;
    }).join('\n');

    memoryTextarea.value = newMemoryContent;

    // Update other displays
    updateRegisterDisplay();
    updateMemoryDisplay();
    updateControlPanel();
}





// Initialize the simulator
function initialize() {
    loadProgram();
    updateRegisterDisplay();
    updateMemoryDisplay();
    updateControlPanel();
}

// Start the simulation
initialize();
