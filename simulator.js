const userMemoryMap = {}; // To keep track of updated addresses and their values

//MEMORY - ASM PROGRAM - IP 
const MEMORY_SIZE = 0xE000; // Program memory size up to 0xDFFFF
const MEMORY_START = 0x0000; // Memory starts at 0x0000
const MEMORY_END = 0x2FFF; // Memory ends at 0x2FFF
const memory = new Uint16Array(MEMORY_SIZE); // Adjusted memory size

//STACK
const FRONT = 0xFFFF;  // The top of the stack (FRONT of the stack) where values are pushed
const REAR = 0xDEEE;   // The bottom of the stack (REAR of the stack) where values are popped
const STACK_SIZE = FRONT - REAR + 1;  // The number of addresses in the stack
let stack = [];
let stackPointer = FRONT;  // Stack pointer starts at FRONT (top of the stack)

// USER MEMORY
const USR_MEMORY_SIZE = 0x1000; // User dynamic memory size
const USR_MEMORY_START = 0x0000; // User memory starts at 0x0000
const USR_MEMORY_END = 0x1000; // User memory ends at 0x1000
const UserMemory = new Uint16Array(USR_MEMORY_SIZE);

//REGISTERS
const registers = new Uint16Array(8); // 8 registers (R0 to R7)
let instructionPointer = 0x0000; // Program Counter (IP) starts at 0x0000
let carryFlag = 0; // Carry flag (0: no carry, 1: carry)
let zeroFlag = 0;  // Zero flag (0: no zero result, 1: zero result)
let halted = false; // Add a global variable to track program state
const HEX_MASK = 0xFFFF; // Mask to ensure 16-bit values

//UI
const memoryInput = document.getElementById('dynamicMemoryContentsForUser');
const addMemoryButton = document.getElementById('addMemoryContent');


addMemoryButton.addEventListener('click', () => {
    const inputValue = memoryInput.value.trim();
    if (!inputValue) {
        alert("Please provide a memory address and content.");
        return;
    }

    const [address, content] = inputValue.split(':').map(str => str.trim());
    if (!address.match(/^[0-9A-Fa-f]+$/) || !content.match(/^[0-9A-Fa-f]+$/)) {
        alert("Invalid input format. Use hexadecimal (e.g., 0x0000:0xA).");
        return;
    }

    const memoryAddress = parseInt(address, 16);
    let memoryContent = parseInt(content, 16);

    if (memoryAddress < USR_MEMORY_START || memoryAddress >= USR_MEMORY_END) {
        alert(`Invalid user memory address. Valid range: 0x${USR_MEMORY_START.toString(16)} - 0x${USR_MEMORY_END.toString(16)}`);
        return;
    }

    UserMemory[memoryAddress] = memoryContent; // Update UserMemory
    updateUserMemoryDisplay(memoryAddress); // Update only this address in the display

    // ✅ Add checkmark emoji to success message
    alert(`✅ User Memory at address 0x${memoryAddress.toString(16).toUpperCase()} updated to 0x${memoryContent.toString(16).toUpperCase()} (decimal: ${memoryContent})`);
});


function updateUserMemoryDisplay(updatedAddress) {
    const dynamicMemoryDisplay = document.getElementById('dynamicmemorydisplay');

    if (!dynamicMemoryDisplay) {
        console.error("❌ Error: dynamicmemorydisplay element not found!");
        return;
    }

    // Log the incoming `updatedAddress` value
    console.log("🔍 Debug: updateUserMemoryDisplay called with updatedAddress =", updatedAddress);

    // Check if `updatedAddress` is valid
    if (typeof updatedAddress === 'undefined' || updatedAddress === null) {
        console.error("❌ Error: updatedAddress is undefined or null. Function execution stopped.");
        return;
    }

    // Ensure `updatedAddress` is a valid number before converting
    const safeAddress = Number(updatedAddress);
    if (isNaN(safeAddress) || safeAddress < 0) {
        console.error("❌ Error: updatedAddress is invalid. Received:", updatedAddress);
        return;
    }

    // Now it's safe to convert to hex
    const hexAddress = safeAddress.toString(16).padStart(4, '0').toUpperCase();
    console.log("✅ Debug: Converted hexAddress =", hexAddress);

    // Check if `UserMemory` exists and has data at `safeAddress`
    if (!UserMemory || !(safeAddress in UserMemory) || typeof UserMemory[safeAddress] === 'undefined') {
        console.error(`❌ Error: UserMemory at address 0x${hexAddress} is undefined.`);
        return;
    }

    const value = UserMemory[safeAddress]; // Now safely defined
    console.log("✅ Debug: UserMemory value at address", hexAddress, "=", value);

    // Ensure value is a valid number before converting
    if (typeof value !== 'number' || isNaN(value)) {
        console.error("❌ Error: Value at UserMemory[", safeAddress, "] is not a valid number:", value);
        return;
    }

    const hexValue = `0x${value.toString(16).toUpperCase()}`;

    // Check if the memory entry already exists
    let existingElement = document.getElementById(`userMemory-${hexAddress}`);

    if (existingElement) {
        existingElement.innerHTML = `0x${hexAddress}: ${hexValue} (${value})`;
    } else {
        const newEntry = document.createElement('div');
        newEntry.id = `userMemory-${hexAddress}`;
        newEntry.className = 'user-memory-item';
        newEntry.innerHTML = `0x${hexAddress}: ${hexValue} (${value})`;
        dynamicMemoryDisplay.appendChild(newEntry);
    }

    // Flash the last updated memory entry
    flashElement(`userMemory-${hexAddress}`);
}

const instructions = {

    "INR": (rd) => {
        registers[rd] = (registers[rd] + 1) & HEX_MASK;
        zeroFlag = registers[rd] === 0 ? 1 : 0;
        updateFlagsDisplay();
        updateRegisterDisplay();
    },

    "DCR": (rd) => {
        registers[rd] = (registers[rd] - 1) & HEX_MASK;
        zeroFlag = registers[rd] === 0 ? 1 : 0;
        updateFlagsDisplay();
        updateRegisterDisplay();
    },
    "SET": (rd) => {
        registers[rd] = 0xFFFF;
        updateRegisterDisplay();
    },

    // ✅ CLEAR a specific register to 0x0000
    "CLEAR": (rd) => {
        registers[rd] = 0x0000;
        updateRegisterDisplay();
    },

    // ✅ ONE: Set a specific register to 0x0001
    "ONE": (rd) => {
        registers[rd] = 0x0001;
        updateRegisterDisplay();
    },

    // ✅ SET_ALL: Set all registers to 0xFFFF
    "SET_ALL": () => {
        for (let i = 0; i < registers.length; i++) {
            registers[i] = 0xFFFF;
        }
        updateRegisterDisplay();
    },

    // ✅ CLEAR_ALL: Clear all registers to 0x0000
    "CLEAR_ALL": () => {
        for (let i = 0; i < registers.length; i++) {
            registers[i] = 0x0000;
        }
        updateRegisterDisplay();
    },

    // ✅ ONE_ALL: Set all registers to 0x0001
    "ONE_ALL": () => {
        for (let i = 0; i < registers.length; i++) {
            registers[i] = 0x0001;
        }
        updateRegisterDisplay();
    },

    "SWAP": (rd, rs) => {
        [registers[rd], registers[rs]] = [registers[rs], registers[rd]];
        updateRegisterDisplay();
    },

    "CLZ": (rd, rs) => {
        let value = registers[rs];
        let count = 0;
        while ((value & 0x8000) === 0 && count < 16) {
            value <<= 1;
            count++;
        }
        registers[rd] = count;
        updateRegisterDisplay();
    },

    "CTZ": (rd, rs) => {
        let value = registers[rs];
        let count = 0;
        while ((value & 1) === 0 && count < 16) {
            value >>= 1;
            count++;
        }
        registers[rd] = count;
        updateRegisterDisplay();
    },

    "ROLN": (rd, rs) => {
        let shiftAmount = registers[rs] & 0xF;
        registers[rd] = ((registers[rd] << shiftAmount) | (registers[rd] >> (16 - shiftAmount))) & HEX_MASK;
        updateRegisterDisplay();
    },

    "RORN": (rd, rs) => {
        let shiftAmount = registers[rs] & 0xF;
        registers[rd] = ((registers[rd] >> shiftAmount) | (registers[rd] << (16 - shiftAmount))) & HEX_MASK;
        updateRegisterDisplay();
    },

    "MAX": (rd, rs, rt) => {
        registers[rd] = Math.max(registers[rs], registers[rt]);
        updateRegisterDisplay();
    },

    "MIN": (rd, rs, rt) => {
        registers[rd] = Math.min(registers[rs], registers[rt]);
        updateRegisterDisplay();
    },

    "REV": (rd, rs) => {
        let value = registers[rs];
        let reversed = 0;
        for (let i = 0; i < 16; i++) {
            reversed = (reversed << 1) | (value & 1);
            value >>= 1;
        }
        registers[rd] = reversed;
        updateRegisterDisplay();
    },

    "CRC": (rd, rs, rt) => {
        let data = registers[rs];
        let poly = registers[rt];
        let crc = data;

        for (let i = 0; i < 16; i++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ poly;
            } else {
                crc <<= 1;
            }
            crc &= HEX_MASK;
        }

        registers[rd] = crc;
        updateRegisterDisplay();
    },


    // 1. Data Movement Instructions
    "LDL": (rd, val) => {
        if (val < 0 || val > 0xFFFF) {
            throw new Error(`Invalid constant value: 0x${val.toString(16).toUpperCase()}`);
        }
        registers[rd] = val & HEX_MASK;
        zeroFlag = (registers[rd] === 0) ? 1 : 0;
        updateFlagsDisplay();
        console.log(`LDL: Loaded constant 0x${val.toString(16).toUpperCase()} into R${rd}`);
    },

    "LDH": (rd, val) => { registers[rd] = ((val << 8) | (registers[rd] & 0x00FF)) & HEX_MASK; },
    "LDD": (rd, address) => {
        if (address < USR_MEMORY_START || address >= USR_MEMORY_END) {
            throw new Error(`Invalid user memory address: 0x${address.toString(16).toUpperCase()}`);
        }
        registers[rd] = UserMemory[address] & HEX_MASK;
        zeroFlag = (registers[rd] === 0) ? 1 : 0;
        updateFlagsDisplay();
        updateRegisterDisplay();
        console.log(`LDD: Loaded 0x${UserMemory[address].toString(16).toUpperCase()} into R${rd}`);
    },

    "LDR": (rd, rs) => {
        const address = registers[rs];
        if (address < USR_MEMORY_START || address >= USR_MEMORY_END) {
            throw new Error(`Invalid user memory address: 0x${address.toString(16).toUpperCase()}`);
        }
        registers[rd] = UserMemory[address] & HEX_MASK;
        zeroFlag = (registers[rd] === 0) ? 1 : 0;
        updateFlagsDisplay();
        updateRegisterDisplay();
        console.log(`LDR: Loaded 0x${UserMemory[address].toString(16).toUpperCase()} into R${rd}`);
    },
    "STO": (rs, address) => {
        if (address < USR_MEMORY_START || address >= USR_MEMORY_END) {
            throw new Error(`Invalid memory address: 0x${address.toString(16).toUpperCase()}`);
        }
        UserMemory[address] = registers[rs] & HEX_MASK; // Store value from register into address
        console.log(`STO: Stored value 0x${registers[rs].toString(16).toUpperCase()} from R${rs} into address 0x${address.toString(16).toUpperCase()}`);
        updateUserMemoryDisplay(address); // Highlight updated memory
    },

    // STR: Store value from a register into the memory address specified by another register
    "STR": (rs, rd) => {
        const address = registers[rd]; // Use value in rd as the address
        if (address < USR_MEMORY_START || address >= USR_MEMORY_END) {
            throw new Error(`Invalid memory address: 0x${address.toString(16).toUpperCase()}`);
        }
        UserMemory[address] = registers[rs] & HEX_MASK; // Store value with masking
        console.log(`STR: Stored value 0x${registers[rs].toString(16).toUpperCase()} from R${rs} into address pointed by R${rd} (0x${address.toString(16).toUpperCase()})`);
        updateUserMemoryDisplay(address); // Update display for the updated address
    },
    "PSH": (rd) => {
        if (stackPointer <= REAR) {
            alert("Stack Overflow!");
            return;
        }
        stack.push({
            address: stackPointer,
            contents: registers[rd] & HEX_MASK
        });
        stackPointer--;
        alert(`PSH: Pushed value 0x${registers[rd].toString(16).toUpperCase()} from R${rd} onto the stack at address 0x${stackPointer.toString(16).toUpperCase()}`);
        updateStackDisplay();
    },
    "POP": (rd) => {
        if (stackPointer >= FRONT) {
            alert("Stack Underflow!");
            return;
        }
        stackPointer++;
        const poppedItem = stack.pop();
        registers[rd] = poppedItem.contents & HEX_MASK;
        alert(`POP: Popped value 0x${registers[rd].toString(16).toUpperCase()} into R${rd} from address 0x${poppedItem.address.toString(16).toUpperCase()}`);
        updateStackDisplay();
    },

    // 2. Arithmetic Instructions
    "ADD": (rd, rs, rt) => {
        const result = registers[rs] + registers[rt];
        carryFlag = (result > 0xFFFF) ? 1 : 0;
        registers[rd] = result & 0xFFFF;
        zeroFlag = (registers[rd] === 0) ? 1 : 0;
        updateFlagsDisplay();
        console.log(`ADD: 0x${registers[rs].toString(16).toUpperCase()} + 0x${registers[rt].toString(16).toUpperCase()} = 0x${registers[rd].toString(16).toUpperCase()}`);
    },
    "SUB": (rd, rs, rt) => {
        const result = registers[rs] - registers[rt];
        carryFlag = (result < 0) ? 1 : 0;
        registers[rd] = (result & 0xFFFF);
        zeroFlag = (registers[rd] === 0) ? 1 : 0;
        updateFlagsDisplay();
        console.log(`SUB: 0x${registers[rs].toString(16).toUpperCase()} - 0x${registers[rt].toString(16).toUpperCase()} = 0x${registers[rd].toString(16).toUpperCase()}`);
    },
    "MUL": (rd, rs, rt) => {
        const result = registers[rs] * registers[rt]; // Perform multiplication

        // Mask to ensure only the lower 16 bits are stored
        registers[rd] = result & HEX_MASK;

        // Optional: Log the upper and lower 16 bits for clarity
        const upperBits = (result >> 16) & HEX_MASK; // Extract upper 16 bits
        const lowerBits = result & HEX_MASK;         // Extract lower 16 bits

        console.log(`MUL: ${registers[rs]} (R${rs}) * ${registers[rt]} (R${rt}) = 0x${result.toString(16).toUpperCase()}`);
        console.log(`MUL: Lower 16 bits: 0x${lowerBits.toString(16).toUpperCase()}, Upper 16 bits: 0x${upperBits.toString(16).toUpperCase()}`);

        // Update zero and carry flags
        carryFlag = (upperBits > 0) ? 1 : 0; // Carry flag if the result exceeds 16 bits
        zeroFlag = (registers[rd] === 0) ? 1 : 0;

        updateFlagsDisplay();
        updateRegisterDisplay();
    },

    "DIV": (rd, rs, rt) => {
        if (registers[rt] === 0) {
            throw new Error("Division by zero error!");
        }
        const result = Math.floor(registers[rs] / registers[rt]);
        const remainder = registers[rs] % registers[rt];
        carryFlag = (remainder !== 0) ? 1 : 0;
        registers[rd] = result & 0xFFFF;
        zeroFlag = (registers[rd] === 0) ? 1 : 0;
        updateFlagsDisplay();
        console.log(`DIV: 0x${registers[rs].toString(16).toUpperCase()} / 0x${registers[rt].toString(16).toUpperCase()} = 0x${registers[rd].toString(16).toUpperCase()}`);
    },

    // 3. Logical Instructions
    "XOR": (rd, rs, rt) => { registers[rd] = (registers[rs] ^ registers[rt]) & HEX_MASK; },
    "OR": (rd, rs, rt) => { registers[rd] = (registers[rs] | registers[rt]) & HEX_MASK; },
    "AND": (rd, rs, rt) => { registers[rd] = (registers[rs] & registers[rt]) & HEX_MASK; },
    "NOT": (rd, rs) => { registers[rd] = ~registers[rs] & HEX_MASK; },

    // 4. Bit Manipulation Instructions
    "SHL": (rd) => {
        // Ensure the register value is treated as a hexadecimal number
        const value = parseInt(registers[rd], 16);

        if (isNaN(value)) {
            throw new Error(`Invalid register value: ${registers[rd]}. Expected hexadecimal.`);
        }

        // Perform bitwise operations
        const carryOut = (value & 0x8000) >> 15; // Extract the carry-out bit (MSB)
        registers[rd] = (value << 1) & HEX_MASK; // Perform a single left shift and mask to fit the register size

        // Update flags
        carryFlag = carryOut; // Update the carry flag
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Update the zero flag

        // Refresh the flags display
        updateFlagsDisplay();
        updateRegisterDisplay();
    },

    "SHLC": (rd, rs) => {
        const shifts = registers[rs] & 0xFFFF; // Extract the number of shifts from the register
        let carryOut = 0;

        for (let i = 0; i < shifts; i++) {
            carryOut = (registers[rd] & 0x8000) >> 15; // Extract the carry-out bit (MSB)
            registers[rd] = (registers[rd] << 1) & HEX_MASK; // Perform a left shift and mask to fit the register size
        }

        carryFlag = carryOut; // Update the carry flag based on the last shift
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Update the zero flag
        updateFlagsDisplay(); // Refresh the flags display
    },

    "SHR": (rd) => {
        const carryOut = registers[rd] & 0x1; // Extract the carry-out bit (LSB)
        registers[rd] = (registers[rd] >> 1) & HEX_MASK; // Perform a single right shift and mask
        carryFlag = carryOut; // Update the carry flag
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Update the zero flag
        updateFlagsDisplay(); // Refresh the flags display
    },
    "SHRC": (rd, rs) => {
        let shifts = registers[rs] & 0xFFFF; // Extract the number of shifts from the register
        shifts = Math.min(shifts, 16); // Limit shifts to the register width

        let carryOut = 0;

        for (let i = 0; i < shifts; i++) {
            carryOut = registers[rd] & 0x1; // Extract the carry-out bit (LSB)
            registers[rd] = (registers[rd] >> 1) & HEX_MASK; // Perform a right shift and mask
        }

        carryFlag = carryOut; // Update the carry flag based on the last shift
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Update the zero flag
        updateFlagsDisplay(); // Refresh the flags display
    },

    "ROL": (rd) => {
        const carryOut = (registers[rd] & 0x8000) >> 15; // Extract the carry-out bit (MSB)
        registers[rd] = ((registers[rd] << 1) | (registers[rd] >> 15)) & HEX_MASK; // Perform a rotate left
        carryFlag = carryOut; // Update the carry flag
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Update the zero flag
        updateFlagsDisplay(); // Refresh the flags display
    },

    "ROLC": (rd, rs) => {
        const shifts = registers[rs] & 0xFFFF; // Extract the number of shifts from the register
        let carryOut = 0;

        for (let i = 0; i < shifts; i++) {
            carryOut = (registers[rd] & 0x8000) >> 15; // Extract the carry-out bit (MSB)
            registers[rd] = ((registers[rd] << 1) | (registers[rd] >> 15)) & HEX_MASK; // Perform a rotate left
        }

        carryFlag = carryOut; // Update the carry flag based on the last rotation
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Update the zero flag
        updateFlagsDisplay(); // Refresh the flags display
    },

    "ROR": (rd) => {
        const carryOut = registers[rd] & 0x1; // Extract the carry-out bit (LSB)
        registers[rd] = ((registers[rd] >> 1) | (registers[rd] << 15)) & HEX_MASK; // Perform a rotate right
        carryFlag = carryOut; // Update the carry flag
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Update the zero flag
        updateFlagsDisplay(); // Refresh the flags display
    },

    "RORC": (rd, rs) => {
        const shifts = registers[rs] & 0xFFFF; // Extract the number of shifts from the register
        let carryOut = 0;

        for (let i = 0; i < shifts; i++) {
            carryOut = registers[rd] & 0x1; // Extract the carry-out bit (LSB)
            registers[rd] = ((registers[rd] >> 1) | (registers[rd] << 15)) & HEX_MASK; // Perform a rotate right
        }

        carryFlag = carryOut; // Update the carry flag based on the last rotation
        zeroFlag = (registers[rd] === 0) ? 1 : 0; // Update the zero flag
        updateFlagsDisplay(); // Refresh the flags display
    },

    // 5. Control Flow Instructions
    "CMP": (rs, rt) => {
        const result = registers[rs] - registers[rt];
        carryFlag = (result >= 0) ? 0 : 1;
        zeroFlag = (result === 0) ? 1 : 0;
        updateFlagsDisplay();
        console.log(`CMP: 0x${registers[rs].toString(16).toUpperCase()} - 0x${registers[rt].toString(16).toUpperCase()} = 0x${result.toString(16).toUpperCase()}`);
    },
    "JNZ": (address) => {
        if (zeroFlag === 0) {
            instructionPointer = address;
            console.log(`JNZ: Jumped to address 0x${address.toString(16).toUpperCase()} because zeroFlag is 0.`);
        } else {
            console.log(`JNZ: No jump, zeroFlag is 1.`);
        }
    },
    "JZ": (address) => {
        if (zeroFlag === 1) {
            instructionPointer = address;
            console.log(`JZ: Jumped to address 0x${address.toString(16).toUpperCase()} because zeroFlag is 1.`);
        } else {
            console.log(`JZ: No jump, zeroFlag is 0.`);
        }
    },
    "JS": (address) => { memory[--stackPointer] = instructionPointer & HEX_MASK; instructionPointer = address; },
    "RTS": () => {
        if (stackPointer >= STACK_END) {
            alert("Stack Underflow!");
            return;
        }
        instructionPointer = memory[++stackPointer] & HEX_MASK;
    },
    "RTI": () => { instructionPointer = memory[++stackPointer] & HEX_MASK; },
    "BRA": (cond, offset) => { if (evaluateCondition(cond)) instructionPointer = (instructionPointer + offset) & HEX_MASK; },
    "HLT": () => {
        console.log("Halting the program");
        halted = true; // Set the halted state to true
    },

    // 6. Input/Output Instructions
    "OUT": (address, rs) => { console.log(`Output at 0x${address.toString(16)}: 0x${registers[rs].toString(16).toUpperCase()}`); },
    "IN": (rd, address) => { registers[rd] = memory[address] & HEX_MASK; }
};


function updateStackDisplay() {
    const stackDisplay = document.getElementById('stackDisplay');

    // If the stack is empty, exit without flashing or updating
    if (stack.length === 0) {
        stackDisplay.innerHTML = ''; // Clear the stack display
        return; // Stop further processing
    }

    // Clear stack display and update only visible content
    stackDisplay.innerHTML = ''; // Reset

    for (let i = stack.length - 1; i >= 0; i--) {
        const address = stack[i].address;
        const contents = stack[i].contents;
        const decimalValue = contents; // Already numeric

        const newStackElement = document.createElement('div');
        newStackElement.id = `stack-item-${i}`;
        newStackElement.textContent = `0x${address.toString(16).toUpperCase()}: 0x${contents.toString(16).toUpperCase()} (${decimalValue})`;

        stackDisplay.appendChild(newStackElement);
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
    programDisplay.value = program.map((inst, index) => {
        const formattedArgs = inst.args.map(arg => {
            if (typeof arg === 'number') {
                const hexValue = `0x${arg.toString(16).toUpperCase()}`; // Convert to hexadecimal
                const decimalValue = `(${arg})`; // Decimal representation
                return `${hexValue} ${decimalValue}`; // Combine both
            }
            return arg; // Leave non-numeric arguments unchanged
        }).join(', ');

        return `${index.toString(16).padStart(4, '0').toUpperCase()}: ${inst.op} ${formattedArgs}`;
    }).join('\n');
}


// Display register values
function updateRegisterDisplay() {
    const registerDisplay = document.querySelector('.register-display');

    registers.forEach((value, index) => {
        const registerElement = document.getElementById(`register-R${index}`);
        const previousValue = registerElement.dataset.value || "0"; // Track previous value using data attribute

        // Update register display content
        registerElement.innerHTML = `
            R${index}: 
            <span style="font-size: larger; color: blue;">0x${value.toString(16).toUpperCase()}</span> 
            (<span style="font-size: smaller; color: red;">${value}</span>)
        `;

        // If the value has changed, trigger the flash effect
        if (previousValue !== value.toString()) {
            flashElement(`register-R${index}`);
            registerElement.dataset.value = value.toString(); // Update the stored value
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


// Previous values to detect changes
let previousIP = null;
let previousSP = null;
let previousCF = null;
let previousZF = null;

function updateControlPanel() {
    const ipElement = document.getElementById('ipDisplay');
    const spElement = document.getElementById('spDisplay');
    const cfElement = document.getElementById('carryFlagDisplay');
    const zfElement = document.getElementById('zeroFlagDisplay');

    // Update IP and flash if changed
    const newIP = `0x${instructionPointer.toString(16).padStart(4, '0').toUpperCase()}`;
    if (previousIP !== newIP) {
        ipElement.textContent = newIP;
        flashElement('ipDisplay');
        previousIP = newIP; // Update previous value
    }

    // Update SP and flash if changed
    const newSP = `0x${stackPointer.toString(16).padStart(4, '0').toUpperCase()}`;
    if (previousSP !== newSP) {
        spElement.textContent = newSP;
        flashElement('spDisplay');
        previousSP = newSP;
    }

    // Update CF and flash if changed
    const newCF = carryFlag === 1 ? '1' : '0';
    if (previousCF !== newCF) {
        cfElement.textContent = newCF;
        flashElement('carryFlagDisplay');
        previousCF = newCF;
    }

    // Update ZF and flash if changed
    const newZF = zeroFlag === 1 ? '1' : '0';
    if (previousZF !== newZF) {
        zfElement.textContent = newZF;
        flashElement('zeroFlagDisplay');
        previousZF = newZF;
    }
}


function executeNext() {

    if (halted) {
        console.log("Program is halted. No further execution.");
        alert("Program has halted.");
        return; // Prevent further execution
    }

    if (instructionPointer >= program.length) {
        alert("End of Program");
        return;
    }

    const { op, args } = program[instructionPointer++];
    if (instructions[op]) {
        instructions[op](...args);
    }

    const memoryTextarea = document.getElementById('InMemoryProgram');
    const memoryLines = memoryTextarea.value.split('\n');
    const newMemoryContent = memoryLines.map((line, index) => {
        const address = index.toString(16).padStart(4, '0').toUpperCase();
        return instructionPointer - 1 === index
            ? `[IP] ${address}: ${program[index]?.op || ''} ${program[index]?.args?.join(', ') || ''}`
            : `${address}: ${program[index]?.op || ''} ${program[index]?.args?.join(', ') || ''}`;
    }).join('\n');

    memoryTextarea.value = newMemoryContent;


    updateRegisterDisplay();
    updateMemoryDisplay();
    updateControlPanel();
    updateStackDisplay();
}

function initialize() {
    const defaultProgram = [
        { op: "LDL", args: [0, 5] }, // Load the value 5 into register R0
        { op: "LDL", args: [1, 10] }, // Load the value 10 into register R1
        { op: "ADD", args: [2, 0, 1] } // Add R0 and R1, store the result in R2
    ];
    const asmText = `
    LDL R0, #0x5
    LDL R1, #0xA
    ADD R2, R0, R1`.trim();

    const inputAsmTextarea = document.getElementById('InputASM');
    inputAsmTextarea.value = asmText;

    loadProgram(defaultProgram);
    updateRegisterDisplay();
    updateMemoryDisplay();
    updateControlPanel();
    updateStackDisplay();

    // 🔴 HIDE "RUN NEXT" & "RESET" BUTTONS ON PAGE LOAD
    document.getElementById('RUN_NEXT').style.display = 'none';
    document.getElementById('RESET').style.display = 'none';
}



// Start the simulation
initialize();
