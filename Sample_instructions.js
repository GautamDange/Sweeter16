// Sample_instructions.js

// Array of all instructions with descriptions and syntax supported in the project
const sampleInstructions = [
    {
        name: "LDL",
        description: "Load a constant value into a register.",
        syntax: "LDL Rn, #value",
        example: "LDL R0, #0xA ; Load the value 10 into R0"
    },
    {
        name: "ADD",
        description: "Add the values of two registers and store the result in a destination register.",
        syntax: "ADD Rd, Rs, Rt",
        example: "ADD R2, R0, R1 ; Add R0 and R1, store the result in R2"
    },
    {
        name: "SUB",
        description: "Subtract the value of one register from another and store the result in a destination register.",
        syntax: "SUB Rd, Rs, Rt",
        example: "SUB R2, R0, R1 ; Subtract R1 from R0, store the result in R2"
    },
    {
        name: "MUL",
        description: "Multiply the values of two registers and store the result in a destination register.",
        syntax: "MUL Rd, Rs, Rt",
        example: "MUL R2, R0, R1 ; Multiply R0 and R1, store the result in R2"
    },
    {
        name: "DIV",
        description: "Divide the value of one register by another and store the result in a destination register.",
        syntax: "DIV Rd, Rs, Rt",
        example: "DIV R2, R0, R1 ; Divide R0 by R1, store the result in R2"
    },
    {
        name: "CMP",
        description: "Compare two registers and update the flags.",
        syntax: "CMP Rs, Rt",
        example: "CMP R0, R1 ; Compare the values in R0 and R1"
    },
    {
        name: "LDH",
        description: "Load the high byte of a constant into a register.",
        syntax: "LDH Rn, #value",
        example: "LDH R0, #0xFF ; Load the high byte 0xFF into R0"
    },
    {
        name: "LDD",
        description: "Load a value from memory into a register.",
        syntax: "LDD Rn, address",
        example: "LDD R0, 0x1000 ; Load value at address 0x1000 into R0"
    },
    {
        name: "LDR",
        description: "Load a value from a memory address specified by another register.",
        syntax: "LDR Rn, Rm",
        example: "LDR R0, R1 ; Load value at address in R1 into R0"
    },
    {
        name: "STO",
        description: "Store a value from a register into a memory address.",
        syntax: "STO address, Rn",
        example: "STO 0x1000, R0 ; Store value in R0 at address 0x1000"
    },
    {
        name: "STR",
        description: "Store a value from a register into a memory address specified by another register.",
        syntax: "STR Rn, Rm",
        example: "STR R0, R1 ; Store value in R0 at address in R1"
    },
    {
        name: "PSH",
        description: "Push the value of a register onto the stack.",
        syntax: "PSH Rn",
        example: "PSH R0 ; Push the value in R0 onto the stack"
    },
    {
        name: "POP",
        description: "Pop the top value from the stack into a register.",
        syntax: "POP Rn",
        example: "POP R0 ; Pop the top value from the stack into R0"
    },
    {
        name: "JZ",
        description: "Jump to the specified address if the Zero flag is set.",
        syntax: "JZ address",
        example: "JZ 0x100 ; Jump to address 0x100 if Zero flag is set"
    },
    {
        name: "JNZ",
        description: "Jump to the specified address if the Zero flag is not set.",
        syntax: "JNZ address",
        example: "JNZ 0x100 ; Jump to address 0x100 if Zero flag is not set"
    },
    {
        name: "JS",
        description: "Jump to the specified address and save the return address on the stack.",
        syntax: "JS address",
        example: "JS 0x200 ; Jump to subroutine at address 0x200"
    },
    {
        name: "HLT",
        description: "Halt the program execution.",
        syntax: "HLT",
        example: "HLT ; Halt the program"
    },
    {
        name: "SHL",
        description: "Perform a left shift operation on a register.",
        syntax: "SHL Rn",
        example: "SHL R0 ; Shift the value in R0 left by one bit"
    },
    {
        name: "SHR",
        description: "Perform a right shift operation on a register.",
        syntax: "SHR Rn",
        example: "SHR R0 ; Shift the value in R0 right by one bit"
    },
    {
        name: "ROL",
        description: "Perform a left rotate operation on a register.",
        syntax: "ROL Rn",
        example: "ROL R0 ; Rotate the value in R0 left by one bit"
    },
    {
        name: "ROR",
        description: "Perform a right rotate operation on a register.",
        syntax: "ROR Rn",
        example: "ROR R0 ; Rotate the value in R0 right by one bit"
    },
    {
        name: "XOR",
        description: "Perform a bitwise XOR operation between two registers.",
        syntax: "XOR Rd, Rs, Rt",
        example: "XOR R2, R0, R1 ; Perform R0 XOR R1, store result in R2"
    },
    {
        name: "OR",
        description: "Perform a bitwise OR operation between two registers.",
        syntax: "OR Rd, Rs, Rt",
        example: "OR R2, R0, R1 ; Perform R0 OR R1, store result in R2"
    },
    {
        name: "AND",
        description: "Perform a bitwise AND operation between two registers.",
        syntax: "AND Rd, Rs, Rt",
        example: "AND R2, R0, R1 ; Perform R0 AND R1, store result in R2"
    },
    {
        name: "NOT",
        description: "Perform a bitwise NOT operation on a register.",
        syntax: "NOT Rd, Rs",
        example: "NOT R2, R0 ; Perform NOT operation on R0, store result in R2"
    }
];

// Export the sample instructions for use in the application
export default sampleInstructions;
