// Define the instruction set with updated operand rules

const instructionSet = {
    "ADD": { params: 3, types: ["R", "R", "R"] },   // Add two registers into a destination register
    "SUB": { params: 3, types: ["R", "R", "R"] },   // Subtract two registers into a destination register
    "DIV": { "params": 3, "types": ["R", "R", "R"] },//  Division
    "MUL": { "params": 3, "types": ["R", "R", "R"] }, // Multiplication
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
    "SHL": { params: 2, types: ["R", "R"] },        // Shift left
    "SHR": { params: 2, types: ["R", "R"] },        // Shift right
    "ROL": { params: 2, types: ["R", "R"] },        // Rotate left
    "ROR": { params: 2, types: ["R", "R"] },        // Rotate right
    "LDL": { params: 2, types: ["R", "C"] },        // Load a constant into a register
    "LDH": { params: 2, types: ["R", "C"] },        // Load high byte of a constant into a register
    "LDD": { params: 2, types: ["R", "MR"] },       // Load from memory (by register) into a register
    "STO": { params: 2, types: ["MR", "R"] },

    "OUT": { params: 2, types: ["MR", "R"] },       // Output register value to memory (I/O)
    "IN": { params: 2, types: ["R", "MR"] },        // Input from memory (I/O) to a register

    "PSH": { params: 1, types: ["R"] },
    "POP": { params: 1, types: ["R"] },

    "JZ": { params: 1, types: ["AD"] },             // Jump if zero
    "JC": { params: 1, types: ["AD"] },             // Jump if carry
    "JNZ": { params: 2, types: ["R", "AD"] },       // Jump if not zero
    "JNC": { params: 2, types: ["AD"] },            // Jump if not carry
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

    if (!instructionSet[op]) {
        throw new Error(`Unknown instruction "${op}" on line ${lineNumber}.`);
    }

    const { params, types } = instructionSet[op];
    if (parts.length - 1 !== params) {
        throw new Error(`"${op}" expects ${params} operands but got ${parts.length - 1}.`);
    }

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
