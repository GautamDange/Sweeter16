// Memory size and layout setup
const MEMORY_SIZE = 0xE000; // Program memory size up to 0xDFFFF
const MEMORY_START = 0x0000; // Memory starts at 0x0000
const MEMORY_END = 0x2FFF; // Memory ends at 0x2FFF
const memory = new Uint16Array(MEMORY_SIZE); // Adjusted memory size

// Corrected Stack size and range definitions
const FRONT = 0xFFFF;  // The top of the stack (FRONT of the stack) where values are pushed
const REAR = 0xDEEE;   // The bottom of the stack (REAR of the stack) where values are popped
const STACK_SIZE = FRONT - REAR + 1;  // The number of addresses in the stack
let stack = [];
let stackPointer = FRONT;  // Stack pointer starts at FRONT (top of the stack)

// Register and control variables
const registers = new Uint16Array(8); // 8 registers (R0 to R7)
let instructionPointer = 0x0000; // Program Counter (IP) starts at 0x0000
let carryFlag = 0; // Carry flag (0: no carry, 1: carry)
let zeroFlag = 0;  // Zero flag (0: no zero result, 1: zero result)
const HEX_MASK = 0xFFFF; // Mask to ensure 16-bit values

// UI elements for dynamic memory content input and updating
const memoryInput = document.getElementById('dynamicMemoryContentsForUser');
const addMemoryButton = document.getElementById('addMemoryContent');

// Event listener for the Add Memory Content button
addMemoryButton.addEventListener('click', () => {
    const inputValue = memoryInput.value.trim();

    // Ensure the input is not empty
    if (!inputValue) {
        alert("Please provide a memory address and content.");
        return;
    }

    // Split the input into memory address and content
    const [address, content] = inputValue.split(':').map(str => str.trim());

    // Validate the input format (address and content should be in hexadecimal)
    if (!address.match(/^[0-9A-Fa-f]+$/)) {
        alert("Invalid memory address format. Please use hexadecimal format for address (e.g., 0x0000).");
        return;
    }

    // Check if content is in hexadecimal format
    if (!content.match(/^[0-9A-Fa-f]+$/)) {
        alert("Invalid content format. Please enter the content in hexadecimal format (e.g., 0xA for hexadecimal).");
        return;
    }

    // Convert address to hexadecimal
    const memoryAddress = parseInt(address, 16); // Convert address to hex

    // Convert content to hexadecimal
    let memoryContent = parseInt(content, 16); // Treat content as hexadecimal value

    // Ensure the address is within valid memory range
    if (memoryAddress < 0 || memoryAddress >= MEMORY_SIZE) {
        alert(`Invalid memory address. Please enter a value between 0 and ${MEMORY_SIZE - 1}.`);
        return;
    }

    // Store the content at the specified memory address
    memory[memoryAddress] = memoryContent;

    // Update the dynamic memory display to reflect the change
    updateDynamicMemoryDisplay();

    // Optionally show an alert to confirm the memory update
    alert(`Memory at address 0x${memoryAddress.toString(16).toUpperCase()} updated to 0x${memoryContent.toString(16).toUpperCase()} (decimal: ${memoryContent})`);
});



const instructions = {
    "LDL": (rd, address) => {
        // Ensure the address is within the memory range
        if (address < MEMORY_START || address >= MEMORY_SIZE) {
            throw new Error(`Invalid memory address: 0x${address.toString(16).toUpperCase()}`);
        }

        // Load the content at the memory address into the register
        registers[rd] = memory[address] & HEX_MASK;

        // Set the zero flag if the value loaded is zero
        zeroFlag = (registers[rd] === 0) ? 1 : 0;

        // Update flags display
        updateFlagsDisplay();

        console.log(`LDL: Loaded 0x${memory[address].toString(16).toUpperCase()} from memory address 0x${address.toString(16).toUpperCase()} into R${rd}`);
    },

    "LDH": (rd, val) => { registers[rd] = ((val << 8) | (registers[rd] & 0x00FF)) & HEX_MASK; },
    "ADD": (rd, rs, rt) => {
        const result = registers[rs] + registers[rt];
        carryFlag = (result > 0xFFFF) ? 1 : 0;
        registers[rd] = result & 0xFFFF;

        zeroFlag = (registers[rd] === 0) ? 1 : 0;

        // Update the display for carry and zero flags
        updateFlagsDisplay();

        console.log(`ADD: 0x${registers[rs].toString(16).toUpperCase()} + 0x${registers[rt].toString(16).toUpperCase()} = 0x${registers[rd].toString(16).toUpperCase()}`);
    },


    "SUB": (rd, rs, rt) => {
        const result = registers[rs] - registers[rt];
        carryFlag = (result < 0) ? 1 : 0;  // Handle carry (borrow)
        registers[rd] = (result & 0xFFFF);

        zeroFlag = (registers[rd] === 0) ? 1 : 0;  // Set zero flag if result is zero

        // Update the display for carry and zero flags
        updateFlagsDisplay();

        console.log(`SUB: 0x${registers[rs].toString(16).toUpperCase()} - 0x${registers[rt].toString(16).toUpperCase()} = 0x${registers[rd].toString(16).toUpperCase()}`);
    },


    "MUL": (rd, rs, rt) => {
        const result = registers[rs] * registers[rt];

        // Set carry flag if the result exceeds 16 bits (overflow)
        carryFlag = (result > 0xFFFF) ? 1 : 0;

        registers[rd] = result & 0xFFFF;  // Ensure result fits within 16-bit register

        // Set zero flag if the result is zero
        zeroFlag = (registers[rd] === 0) ? 1 : 0;

        // Update the display for carry and zero flags
        updateFlagsDisplay();

        console.log(`MUL: 0x${registers[rs].toString(16).toUpperCase()} * 0x${registers[rt].toString(16).toUpperCase()} = 0x${registers[rd].toString(16).toUpperCase()}`);
    },

    "DIV": (rd, rs, rt) => {
        if (registers[rt] === 0) {
            throw new Error("Division by zero error!");
        }

        const result = Math.floor(registers[rs] / registers[rt]);
        const remainder = registers[rs] % registers[rt];

        // Set carry flag if there's a remainder (non-zero)
        carryFlag = (remainder !== 0) ? 1 : 0;

        registers[rd] = result & 0xFFFF;  // Ensure result fits within 16-bit register

        // Set zero flag if the quotient is zero
        zeroFlag = (registers[rd] === 0) ? 1 : 0;

        // Update the display for carry and zero flags
        updateFlagsDisplay();

        console.log(`DIV: 0x${registers[rs].toString(16).toUpperCase()} / 0x${registers[rt].toString(16).toUpperCase()} = 0x${registers[rd].toString(16).toUpperCase()}`);
    },


    "CMP": (rs, rt) => {
        const result = registers[rs] - registers[rt];

        // Set carry flag if there is no borrow (result >= 0)
        carryFlag = (result >= 0) ? 0 : 1;  // If result is negative, set carry flag

        // Set zero flag if result is zero (i.e., registers are equal)
        zeroFlag = (result === 0) ? 1 : 0;

        // Update the display for carry and zero flags
        updateFlagsDisplay();

        console.log(`CMP: 0x${registers[rs].toString(16).toUpperCase()} - 0x${registers[rt].toString(16).toUpperCase()} = 0x${result.toString(16).toUpperCase()}`);
    },



    "ADC": (rd, rs, rt) => { registers[rd] = (registers[rs] + registers[rt] + (registers[rd] & 1)) & HEX_MASK; },
    "SBB": (rd, rs, rt) => { registers[rd] = (registers[rs] - registers[rt] - (registers[rd] & 1)) & HEX_MASK; },
    "NOT": (rd) => { registers[rd] = ~registers[rd] & HEX_MASK; },
    "SWP": (rd, rs) => { [registers[rd], registers[rs]] = [registers[rs], registers[rd]]; },
    "XOR": (rd, rs, rt) => { registers[rd] = (registers[rs] ^ registers[rt]) & HEX_MASK; },
    "OR": (rd, rs, rt) => { registers[rd] = (registers[rs] | registers[rt]) & HEX_MASK; },
    "AND": (rd, rs, rt) => { registers[rd] = (registers[rs] & registers[rt]) & HEX_MASK; },
    "MKB": (rd, rs, mask) => { registers[rd] = (registers[rs] & mask) & HEX_MASK; },
    "INB": (rd, rs, mask) => { registers[rd] = (registers[rs] ^ mask) & HEX_MASK; },
    "SEB": (rd, rs, mask) => { registers[rd] = (registers[rs] | mask) & HEX_MASK; },
    "CLB": (rd, rs, mask) => { registers[rd] = (registers[rs] & ~mask) & HEX_MASK; },

    // SHL instruction (Shift Left)
    "SHL": (rd) => {
        const carryOut = (registers[rd] & 0x8000) >> 15;  // Capture the leftmost bit (Carry)
        registers[rd] = (registers[rd] << 1) & HEX_MASK;  // Perform the left shift
        carryFlag = carryOut;  // Set the Carry Flag
        zeroFlag = (registers[rd] === 0) ? 1 : 0;  // Set Zero Flag if result is zero
        updateFlagsDisplay();  // Update the flags display
    },

    // SHR instruction (Shift Right)
    "SHR": (rd) => {
        const carryOut = registers[rd] & 0x1;  // Capture the rightmost bit (Carry)
        registers[rd] = (registers[rd] >> 1) & HEX_MASK;  // Perform the right shift
        carryFlag = carryOut;  // Set the Carry Flag
        zeroFlag = (registers[rd] === 0) ? 1 : 0;  // Set Zero Flag if result is zero
        updateFlagsDisplay();  // Update the flags display
    },

    // ROL instruction (Rotate Left)
    "ROL": (rd) => {
        const carryOut = (registers[rd] & 0x8000) >> 15;  // Capture the leftmost bit (Carry)
        registers[rd] = ((registers[rd] << 1) | (registers[rd] >> 15)) & HEX_MASK;  // Rotate left
        carryFlag = carryOut;  // Set the Carry Flag
        zeroFlag = (registers[rd] === 0) ? 1 : 0;  // Set Zero Flag if result is zero
        updateFlagsDisplay();  // Update the flags display
    },

    // ROR instruction (Rotate Right)
    "ROR": (rd) => {
        const carryOut = registers[rd] & 0x1;  // Capture the rightmost bit (Carry)
        registers[rd] = ((registers[rd] >> 1) | (registers[rd] << 15)) & HEX_MASK;  // Rotate right
        carryFlag = carryOut;  // Set the Carry Flag
        zeroFlag = (registers[rd] === 0) ? 1 : 0;  // Set Zero Flag if result is zero
        updateFlagsDisplay();  // Update the flags display
    },

    // LDD instruction (Load from Memory)
    "LDD": (rd, address) => {
        registers[rd] = memory[address] & HEX_MASK; // Ensure we mask the value to fit 16-bit
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Set the zero flag if the value is 0
        updateFlagsDisplay(); // Update the flags display
        console.log(`LDD: Loaded 0x${memory[address].toString(16).toUpperCase()} into R${rd}`);
    },

    // Assuming the instruction is in the format STO <memory_address>, <register>
    "STO": (address, rd) => {
        // Store the value from the register (rd) into the specified memory address (address)
        memory[address] = registers[rd] & HEX_MASK; // Store the 16-bit value from the register
        console.log(`STO: Stored value 0x${registers[rd].toString(16).toUpperCase()} from R${rd} into memory address 0x${address.toString(16).toUpperCase()}`);
        updateMemoryDisplay();
    },

    "OUT": (address, rs) => { console.log(`Output at 0x${address.toString(16)}: 0x${registers[rs].toString(16).toUpperCase()}`); },
    "IN": (rd, address) => { registers[rd] = memory[address] & HEX_MASK; },


    "PSH": (rd) => {
        if (stackPointer <= REAR) {
            alert("Stack Overflow!");
            return;
        }
        // Push the value from register (rd) onto the stack at the current FRONT position
        stack.push({
            address: stackPointer,  // The current stack pointer address (FRONT)
            contents: registers[rd] & HEX_MASK  // The value to push onto the stack from register (rd)
        });
        stackPointer--;  // Decrement the stack pointer to move downward toward REAR
        alert(`PSH: Pushed value 0x${registers[rd].toString(16).toUpperCase()} from R${rd} onto the stack at address 0x${stackPointer.toString(16).toUpperCase()}`);
        updateStackDisplay();
    },

    // Pop (POP) instruction handler
    "POP": (rd) => {
        if (stackPointer >= FRONT) {
            alert("Stack Underflow!");
            return;
        }
        stackPointer++;  // Increment the stack pointer to move upward toward FRONT
        const poppedItem = stack.pop();
        registers[rd] = poppedItem.contents & HEX_MASK;  // Load contents into register (rd)
        alert(`POP: Popped value 0x${registers[rd].toString(16).toUpperCase()} into R${rd} from address 0x${poppedItem.address.toString(16).toUpperCase()}`);
        updateStackDisplay();
    },


    "JS": (address) => { memory[--stackPointer] = instructionPointer & HEX_MASK; instructionPointer = address; },
    "JNZ": (rd, address) => {
        if (registers[rd] !== 0) {
            instructionPointer = address;
        }
    },
    "RTS": () => {
        if (stackPointer >= STACK_END) {
            alert("Stack Underflow!");
            return;
        }
        instructionPointer = memory[++stackPointer] & HEX_MASK;
    },
    "HLT": () => {
        console.log("Halting the program");
        // You can add any necessary termination logic here, if needed.
    },

    "RTI": () => { instructionPointer = memory[++stackPointer] & HEX_MASK; },
    "BRA": (cond, offset) => { if (evaluateCondition(cond)) instructionPointer = (instructionPointer + offset) & HEX_MASK; }


};

// Stack and memory display functions
function updateStackDisplay() {
    const stackDisplay = document.getElementById('stackDisplay');
    let stackContent = '';
    for (let i = stack.length - 1; i >= 0; i--) {
        const address = stack[i].address;
        const contents = stack[i].contents;
        stackContent += `Address: 0x${address.toString(16).toUpperCase()}, Contents: 0x${contents.toString(16).toUpperCase()}\n`;
    }
    stackDisplay.value = stackContent.trim();
}



function updateFlagsDisplay() {
    // Update the Carry Flag display
    const carryFlagDisplay = document.getElementById('carryFlagDisplay');
    carryFlagDisplay.textContent = carryFlag === 1 ? '1' : '0';

    // Update the Zero Flag display
    const zeroFlagDisplay = document.getElementById('zeroFlagDisplay');
    zeroFlagDisplay.textContent = zeroFlag === 1 ? '1' : '0';
}

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
    registerDisplay.innerHTML = ''; // Clear existing content

    registers.forEach((value, index) => {
        const registerElement = document.createElement('span');
        registerElement.innerHTML = `
            R${index}: 
            <span style="font-size: larger; color: blue;">0x${value.toString(16).toUpperCase()}</span> 
            (<span style="font-size: smaller; color: red;">${value}</span>)
        `;
        registerDisplay.appendChild(registerElement);

        // Add a line break after every 4 registers for better readability
        if ((index + 1) % 4 === 0) {
            registerDisplay.appendChild(document.createElement('br'));
        }
    });
}


// Display memory contents, highlighting IP and SP
function updateMemoryDisplay() {
    const programDisplay = document.getElementById('InMemoryProgram');
    const dynamicMemoryDisplay = document.getElementById('dynamicmemorydisplay'); // Added for memory content display

    // Update program memory
    const displayRange = program.length; // Adjust to program size
    let programContent = '';

    // Iterate through the program memory
    for (let i = 0; i < displayRange; i++) {
        const address = i.toString(16).padStart(4, '0').toUpperCase(); // Hexadecimal address
        const instruction = program[i];
        const instructionHex = instruction?.op || ''; // Instruction mnemonic
        const argsHex = instruction?.args.map(arg => `0x${arg.toString(16).toUpperCase()}`).join(', ') || ''; // Hexadecimal args
        const argsDec = instruction?.args.join(', ') || ''; // Decimal args

        // Format each line with both hex and decimal values
        let line = `${address}: ${instructionHex} ${argsHex} (${argsDec})`;

        // Highlight the current instruction pointer (IP)
        if (i === instructionPointer) {
            line = `[IP] ${line}`;
        }

        programContent += line + '\n';
    }

    // Update the program display (textarea)
    programDisplay.value = programContent.trim();



    // Update the dynamic memory display (new addition)
    let dynamicMemoryContent = '';
    for (let i = 0; i < 16; i++) {  // Show first 16 memory addresses, adjust as needed
        const address = i.toString(16).padStart(4, '0').toUpperCase(); // Hexadecimal address
        const value = memory[i] || 0x0000;  // Default to 0x0000 if no value is set in memory
        dynamicMemoryContent += `0x${address}: 0x${value.toString(16).toUpperCase()} (${value})\n`;  // Format memory content
    }

    // Update the dynamic memory display (textarea)
    dynamicMemoryDisplay.value = dynamicMemoryContent.trim();
}


function updateDynamicMemoryDisplay() {
    const dynamicMemoryDisplay = document.getElementById('dynamicmemorydisplay');
    let dynamicMemoryContent = '';

    // Show a selected range of memory addresses and their content
    const rangeToShow = 16; // Show the first 16 memory locations (you can adjust this if needed)
    for (let i = 0; i < rangeToShow; i++) {
        const address = i.toString(16).padStart(4, '0').toUpperCase(); // Hexadecimal address
        const value = memory[i] || 0x0000; // Default to 0x0000 if no value is set
        const hexValue = `0x${value.toString(16).toUpperCase()}`; // Hexadecimal value

        // To show decimal value: parse the value directly (as it's in hex internally)
        const decimalValue = parseInt(value.toString(16), 16); // Convert from hex to decimal for display

        // Format the line for each address and content
        dynamicMemoryContent += `0x${address}: ${hexValue} (${decimalValue})\n`; // Show both hex and decimal
    }

    // Update the dynamic memory display with the formatted content
    dynamicMemoryDisplay.value = dynamicMemoryContent.trim();
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
    updateStackDisplay();
}


// Initialize the simulator
function initialize() {
    const defaultProgram = [
        { op: "LDL", args: [0, 5] }, // Load the value 5 into register R0
        { op: "LDL", args: [1, 10] }, // Load the value 10 into register R1
        { op: "ADD", args: [2, 0, 1] } // Add R0 and R1, store the result in R2
    ];

    // Convert the default program to ASM text
    const asmText = `
LDL R0, #0x5
LDL R1, #0xA
ADD R2, R0, R1`.trim(); // Use hexadecimal constants for consistency with the program.

    // Populate the InputASM textarea
    const inputAsmTextarea = document.getElementById('InputASM');
    inputAsmTextarea.value = asmText;

    // Load the default program into the simulator
    loadProgram(defaultProgram);
    updateRegisterDisplay();
    updateMemoryDisplay();
    updateControlPanel();
    updateStackDisplay();
}


// Start the simulation
initialize();
