// Define the instruction set with updated operand rules

const instructionSet = {

    // New Instructions
    "INR": { params: 1, types: ["R"] }, // Increment R1
    "DCR": { params: 1, types: ["R"] }, // Decrement R2
    "SET": { params: 1, types: ["R"] },   // SET R1 → Only sets R1
    "CLEAR": { params: 1, types: ["R"] }, // CLEAR R2 → Only clears R2
    "ONE": { params: 1, types: ["R"] },   // ONE R3 → Only sets R3 to 1
    "SET_ALL": { params: 0, types: [] },   // SET_ALL → Sets all registers to 0xFFFF
    "CLEAR_ALL": { params: 0, types: [] }, // CLEAR_ALL → Clears all registers
    "ONE_ALL": { params: 0, types: [] },   // ONE_ALL → Sets all registers to 0x0001
    "SWAP": { params: 2, types: ["R", "R"] }, // Swap two registers
    "CLZ": { params: 2, types: ["R", "R"] }, // Count leading zeros
    "CTZ": { params: 2, types: ["R", "R"] }, // Count trailing zeros
    "ROLN": { params: 2, types: ["R", "R"] }, // Rotate left by R2 bits
    "RORN": { params: 2, types: ["R", "R"] }, // Rotate right by R2 bits
    "MAX": { params: 3, types: ["R", "R", "R"] }, // Max(R1, R2)
    "MIN": { params: 3, types: ["R", "R", "R"] }, // Min(R1, R2)
    "REV": { params: 2, types: ["R", "R"] }, // Reverse bits of R1 into R2
    "CRC": { params: 3, types: ["R", "R", "R"] }, // CRC of R1 using R2, store in R3


    "ADD": { params: 3, types: ["R", "R", "R"] },   // Add two registers into a destination register
    "SUB": { params: 3, types: ["R", "R", "R"] },   // Subtract two registers into a destination register
    "DIV": { params: 3, types: ["R", "R", "R"] },//  Division
    "MUL": { params: 3, types: ["R", "R", "R"] }, // Multiplication
    "ADC": { params: 3, types: ["R", "R", "R"] },   // Add with carry
    "SBB": { params: 3, types: ["R", "R", "R"] },   // Subtract with borrow
    "NOT": { params: 2, types: ["R", "R"] },        // Logical NOT
    "SWP": { params: 2, types: ["R", "R"] },        // Swap two registers
    "XOR": { params: 3, types: ["R", "R", "R"] },   // XOR operation
    "OR": { params: 3, types: ["R", "R", "R"] },    // OR operation
    "AND": { params: 3, types: ["R", "R", "R"] },   // AND operation
    "MKB": { params: 3, types: ["R", "R", "C"] },   // Mask a bit
    "INB": { params: 3, types: ["R", "R", "C"] },   // Invert a bit
    "SEB": { params: 3, types: ["R", "R", "C"] },   // Set a bit
    "CLB": { params: 3, types: ["R", "R", "C"] },   // Clear a bit

    "SHL": { params: 1, types: ["R"] },        // Shift left
    "SHR": { params: 1, types: ["R"] },        // Shift right
    "ROL": { params: 1, types: ["R"] },        // Rotate left
    "ROR": { params: 1, types: ["R"] },        // Rotate right

    "SHLC": { params: 2, types: ["R", "R"] },        // Shift left
    "SHRC": { params: 2, types: ["R", "R"] },        // Shift right
    "ROLC": { params: 2, types: ["R", "R"] },        // Rotate left
    "RORC": { params: 2, types: ["R", "R"] },        // Rotate right

    "LDL": { params: 2, types: ["R", "C"] },        // Load a constant into a register
    "LDH": { params: 2, types: ["R", "C"] },        // Load high byte of a constant into a register
    "LDD": { params: 2, types: ["R", "MR"] },       // Load from memory  into a register
    "LDR": { params: 2, types: ["R", "R"] },       // Load from memory (by register) into a register
    "STO": { params: 2, types: ["R", "MR"] },
    "STR": { params: 2, types: ["R", "R"] },


    "OUT": { params: 2, types: ["MR", "R"] },       // Output register value to memory (I/O)
    "IN": { params: 2, types: ["R", "MR"] },        // Input from memory (I/O) to a register

    "PSH": { params: 1, types: ["R"] },
    "POP": { params: 1, types: ["R"] },

    "JZ": { params: 1, types: ["AD"] },             // Jump if zero
    "JC": { params: 1, types: ["AD"] },             // Jump if carry
    "JNZ": { params: 1, types: ["AD"] },            // Jump if not zero
    "JNC": { params: 1, types: ["AD"] },            // Jump if not carry
    "JS": { params: 1, types: ["AD"] },             // Jump to subroutine
    "JMP": { params: 1, types: ["AD"] },            // Unconditional jump

    "RTS": { params: 0 },                           // Return from subroutine
    "RTI": { params: 0 },                           // Return from interrupt
    "BRA": { params: 2, types: ["COND", "O"] },     // Branch with condition
    "CMP": { params: 2, types: ["R", "R"] },
    "HLT": { params: 0, types: [] }
};


// Helper function to clean a line
const cleanLine = (line) => {
    return line
        .split(';')[0] // Remove inline comments
        .trim() // Remove leading/trailing whitespace
        .replace(/,+/g, '') // Remove commas
        .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

// Parse operands based on the type
const parseOperand = (operand, type, labels) => {
    if (type === "R" && operand.match(/^R[0-7]$/)) {
        return parseInt(operand.slice(1)); // Register number (e.g., R0-R7)
    }
    if (type === "C" && operand.match(/^#0x[0-9A-Fa-f]+$/)) {
        return parseInt(operand.slice(1), 16); // Hexadecimal constant (e.g., #0x10)
    }
    if (type === "AD" && labels[operand] !== undefined) {
        return labels[operand]; // Address resolved from label
    }
    if (type === "AD" && operand.match(/^0x[0-9A-Fa-f]+$/)) {
        return parseInt(operand, 16); // Hexadecimal address (e.g., 0x0004)
    }
    if (type === "MR" && operand.match(/^0x[0-9A-Fa-f]+$/)) {
        return parseInt(operand, 16); // Memory address (e.g., 0x0010)
    }
    throw new Error(`Invalid operand "${operand}" for expected type: ${type}`);
};


// Parse a single line of ASM code
const parseLine = (line, lineNumber, labels) => {
    const parts = line.split(' ');
    const op = parts[0].toUpperCase();

    let instruction = instructionSet[op];

    // 🛠 Check if instructionSet[op] is an array (for overloaded instructions)
    if (Array.isArray(instruction)) {
        instruction = instruction.find(instr => instr.params === parts.length - 1);
        if (!instruction) {
            throw new Error(`No matching instruction for "${op}" on line ${lineNumber}.`);
        }
    }

    // 🛠 If instruction is still undefined, it means it's not in the instruction set
    if (!instruction) {
        throw new Error(`Unknown instruction "${op}" on line ${lineNumber}.`);
    }

    const { params, types } = instruction;

    // 🛠 Ensure correct number of operands
    if (parts.length - 1 !== params) {
        throw new Error(`"${op}" expects ${params} operands but got ${parts.length - 1} on line ${lineNumber}.`);
    }

    // 🛠 Process each operand
    const operands = parts.slice(1).map((operand, index) => {
        return parseOperand(operand, types[index], labels);
    });

    return { op, args: operands };
};



// Main function to assemble the program
function assemble(input) {
    const lines = input.split('\n').map(cleanLine).filter(line => line && !line.startsWith(';')); // Remove empty lines/comments
    const labels = {}; // To store label addresses
    const instructions = [];
    let currentAddress = 0;

    // First pass: Identify labels
    lines.forEach((line) => {
        if (line.endsWith(':')) {
            const label = line.slice(0, -1);
            if (labels[label] !== undefined) {
                throw new Error(`Duplicate label "${label}" found.`);
            }
            labels[label] = currentAddress; // Store the current address for the label
        } else {
            currentAddress += 1; // Increment address for each instruction
        }
    });

    // Second pass: Parse instructions
    lines.forEach((line, index) => {
        if (!line.endsWith(':')) { // Skip labels
            try {
                const instruction = parseLine(line, index + 1, labels);
                instructions.push(instruction);
            } catch (error) {
                throw new Error(`Error on line ${index + 1}: ${error.message}`);
            }
        }
    });

    return instructions;
}

// Export the assemble function for use in the browser
window.assemble = assemble;
