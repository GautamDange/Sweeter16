// Sample_instructions.js

// Array of all instructions with descriptions and syntax supported in the project
const sampleInstructions = [
    {
        name: "ADC",
        description: "Add with carry (uses Carry Flag).",
        syntax: "ADC Rd, Rs, Rt",
        example: "ADC R2, R3, R4 ; R2 = R3 + R4 + CF"
    },
    {
        name: "LDL",
        description: "Load a constant value into a register.",
        syntax: "LDL Rn, #value",
        example: "LDL R2, #0xA ; Load the value 10 into R2"
    },
    {
        name: "ADD",
        description: "Add the values of two registers and store the result in a destination register.",
        syntax: "ADD Rd, Rs, Rt",
        example: "ADD R4, R2, R3 ; Add R2 and R3, store the result in R4"
    },
    {
        name: "SUB",
        description: "Subtract the value of one register from another and store the result in a destination register.",
        syntax: "SUB Rd, Rs, Rt",
        example: "SUB R4, R2, R3 ; Subtract R3 from R2, store the result in R4"
    },
    {
        name: "MUL",
        description: "Multiply the values of two registers and store the result in a destination register.",
        syntax: "MUL Rd, Rs, Rt",
        example: "MUL R4, R2, R3 ; Multiply R2 and R3, store the result in R4"
    },
    {
        name: "DIV",
        description: "Divide the value of one register by another and store the result in a destination register.",
        syntax: "DIV Rd, Rs, Rt",
        example: "DIV R4, R2, R3 ; Divide R2 by R3, store the result in R4"
    },
    {
        name: "DCR",
        description: "Decrement a register by 1.",
        syntax: "DCR Rn",
        example: "DCR R2 ; R2 = R2 - 1"
    },
    {
        name: "CMP",
        description: "Compare two registers and update the flags.",
        syntax: "CMP Rs, Rt",
        example: "CMP R2, R3 ; Compare the values in R2 and R3"
    },
    {
        name: "INR",
        description: "Increment a register by 1.",
        syntax: "INR Rn",
        example: "INR R2 ; R2 = R2 + 1"
    },
    {
        name: "JC",
        description: "Jump to the specified address if the Carry flag is set.",
        syntax: "JC 0xADDR | JC label",
        example: "JC 0x0006 ; Jump if CF==1"
    },
    {
        name: "JNC",
        description: "Jump to the specified address if the Carry flag is not set.",
        syntax: "JNC 0xADDR | JNC label",
        example: "JNC 0x0006 ; Jump if CF==0"
    },
    {
        name: "JMP",
        description: "Unconditional jump to the specified address or label.",
        syntax: "JMP 0xADDR | JMP label",
        example: "JMP 0x0006 ; Jump to instruction index 6"
    },
    {
        name: "LDH",
        description: "Load the high byte of a constant into a register (low byte preserved).",
        syntax: "LDH Rn, #value",
        example: "LDH R2, #0xFF ; Set high byte of R2 to 0xFF"
    },
    {
        name: "LDD",
        description: "Load a value from user memory at a fixed address into a register.",
        syntax: "LDD Rn, 0xADDR",
        example: "LDD R2, 0x0008 ; Load UserMemory[0x0008] into R2"
    },
    {
        name: "LDR",
        description: "Load a value from user memory at the address contained in a register.",
        syntax: "LDR Rd, Rs",
        example: "LDR R2, R3 ; Load UserMemory[R3] into R2"
    },
    {
        name: "STO",
        description: "Store a register value into user memory at a fixed address.",
        syntax: "STO Rn, 0xADDR",
        example: "STO R2, 0x0008 ; Store R2 into UserMemory[0x0008]"
    },
    {
        name: "STR",
        description: "Store a register value into user memory at the address contained in another register.",
        syntax: "STR Rs, Rd",
        example: "STR R2, R3 ; Store R2 into UserMemory[R3]"
    },
    {
        name: "CLEAR",
        description: "Clear a register to 0x0000.",
        syntax: "CLEAR Rn",
        example: "CLEAR R2 ; R2 = 0x0000"
    },
    {
        name: "CLEAR_ALL",
        description: "Clear all writable registers (R2..R7) to 0x0000. Fixed registers R0/R1 stay 0 and 1.",
        syntax: "CLEAR_ALL",
        example: "CLEAR_ALL ; R2..R7 = 0x0000 (R0/R1 remain fixed)"
    },
    {
        name: "IN",
        description: "Read a value from memory-mapped address into a register.",
        syntax: "IN Rn, 0xADDR",
        example: "IN R2, 0x0008 ; Read memory into R2"
    },
    {
        name: "OUT",
        description: "Write a register value to a memory-mapped address (I/O).",
        syntax: "OUT 0xADDR, Rn",
        example: "OUT 0x0008, R2 ; Write R2 to address"
    },
    {
        name: "ONE",
        description: "Set a register to 0x0001.",
        syntax: "ONE Rn",
        example: "ONE R2 ; R2 = 0x0001"
    },
    {
        name: "ONE_ALL",
        description: "Set all writable registers (R2..R7) to 0x0001. Fixed registers R0/R1 stay 0 and 1.",
        syntax: "ONE_ALL",
        example: "ONE_ALL ; R2..R7 = 0x0001 (R0/R1 remain fixed)"
    },
    {
        name: "POP",
        description: "Pop the top value from the stack into a register.",
        syntax: "POP Rn",
        example: "POP R2 ; Pop the top value from the stack into R2"
    },
    {
        name: "PSH",
        description: "Push the value of a register onto the stack.",
        syntax: "PSH Rn",
        example: "PSH R2 ; Push the value in R2 onto the stack"
    },
    {
        name: "RTI",
        description: "Return from interrupt (simulated as stack pop of the return address).",
        syntax: "RTI",
        example: "RTI ; Return from interrupt"
    },
    {
        name: "RTS",
        description: "Return from subroutine (pops the return address from the stack).",
        syntax: "RTS",
        example: "RTS ; Return to caller"
    },
    {
        name: "SBB",
        description: "Subtract with borrow (uses Carry Flag).",
        syntax: "SBB Rd, Rs, Rt",
        example: "SBB R2, R3, R4 ; R2 = R3 - R4 - CF"
    },
    {
        name: "SET",
        description: "Set a register to 0xFFFF.",
        syntax: "SET Rn",
        example: "SET R2 ; R2 = 0xFFFF"
    },
    {
        name: "SET_ALL",
        description: "Set all writable registers (R2..R7) to 0xFFFF. Fixed registers R0/R1 stay 0 and 1.",
        syntax: "SET_ALL",
        example: "SET_ALL ; R2..R7 = 0xFFFF (R0/R1 remain fixed)"
    },
    {
        name: "SWAP",
        description: "Swap the values of two registers.",
        syntax: "SWAP Rd, Rs",
        example: "SWAP R2, R3 ; Swap R2 and R3"
    },
    {
        name: "CLZ",
        description: "Count leading zeros of Rs and write the count into Rd.",
        syntax: "CLZ Rd, Rs",
        example: "CLZ R2, R3 ; R2 = clz(R3)"
    },
    {
        name: "CTZ",
        description: "Count trailing zeros of Rs and write the count into Rd.",
        syntax: "CTZ Rd, Rs",
        example: "CTZ R2, R3 ; R2 = ctz(R3)"
    },
    {
        name: "ROLN",
        description: "Rotate left Rd by (Rs & 0xF) bits.",
        syntax: "ROLN Rd, Rs",
        example: "ROLN R2, R3 ; R2 = rol(R2, R3)"
    },
    {
        name: "RORN",
        description: "Rotate right Rd by (Rs & 0xF) bits.",
        syntax: "RORN Rd, Rs",
        example: "RORN R2, R3 ; R2 = ror(R2, R3)"
    },
    {
        name: "MAX",
        description: "Compute max(Rs, Rt) and store the result in Rd.",
        syntax: "MAX Rd, Rs, Rt",
        example: "MAX R2, R3, R4 ; R2 = max(R3, R4)"
    },
    {
        name: "MIN",
        description: "Compute min(Rs, Rt) and store the result in Rd.",
        syntax: "MIN Rd, Rs, Rt",
        example: "MIN R2, R3, R4 ; R2 = min(R3, R4)"
    },
    {
        name: "REV",
        description: "Reverse the bits of Rs and store into Rd.",
        syntax: "REV Rd, Rs",
        example: "REV R2, R3 ; R2 = bitreverse(R3)"
    },
    {
        name: "CRC",
        description: "Compute a simple CRC-like transform using Rs (data) and Rt (poly) into Rd.",
        syntax: "CRC Rd, Rs, Rt",
        example: "CRC R2, R3, R4 ; R2 = crc(R3, R4)"
    },
    {
        name: "JZ",
        description: "Jump to the specified address if the Zero flag is set.",
        syntax: "JZ 0xADDR | JZ label",
        example: "JZ 0x0006 ; Jump if ZF==1"
    },
    {
        name: "JNZ",
        description: "Jump to the specified address if the Zero flag is not set.",
        syntax: "JNZ 0xADDR | JNZ label",
        example: "JNZ 0x0006 ; Jump if ZF==0"
    },
    {
        name: "JS",
        description: "Jump to the specified address and save the return address on the stack.",
        syntax: "JS 0xADDR | JS label",
        example: "JS 0x0008 ; Jump to subroutine"
    },
    {
        name: "HLT",
        description: "Halt the program execution.",
        syntax: "HLT",
        example: "HLT ; Halt the program"
    },
    {
        name: "SHLC",
        description: "Shift left Rd by the amount in Rs.",
        syntax: "SHLC Rd, Rs",
        example: "SHLC R2, R3 ; Shift R2 left by R3"
    },
    {
        name: "SHRC",
        description: "Shift right Rd by the amount in Rs.",
        syntax: "SHRC Rd, Rs",
        example: "SHRC R2, R3 ; Shift R2 right by R3"
    },
    {
        name: "ROLC",
        description: "Rotate left Rd by the amount in Rs.",
        syntax: "ROLC Rd, Rs",
        example: "ROLC R2, R3 ; Rotate R2 left by R3"
    },
    {
        name: "RORC",
        description: "Rotate right Rd by the amount in Rs.",
        syntax: "RORC Rd, Rs",
        example: "RORC R2, R3 ; Rotate R2 right by R3"
    },
    {
        name: "SHL",
        description: "Perform a left shift operation on a register.",
        syntax: "SHL Rn",
        example: "SHL R2 ; Shift the value in R2 left by one bit"
    },
    {
        name: "SHR",
        description: "Perform a right shift operation on a register.",
        syntax: "SHR Rn",
        example: "SHR R2 ; Shift the value in R2 right by one bit"
    },
    {
        name: "ROL",
        description: "Perform a left rotate operation on a register.",
        syntax: "ROL Rn",
        example: "ROL R2 ; Rotate the value in R2 left by one bit"
    },
    {
        name: "ROR",
        description: "Perform a right rotate operation on a register.",
        syntax: "ROR Rn",
        example: "ROR R2 ; Rotate the value in R2 right by one bit"
    },
    {
        name: "MKB",
        description: "Mask a bit in a register using a constant bit index.",
        syntax: "MKB Rd, Rs, #bit",
        example: "MKB R2, R3, #0x0 ; Mask bit 0"
    },
    {
        name: "INB",
        description: "Invert a bit in a register using a constant bit index.",
        syntax: "INB Rd, Rs, #bit",
        example: "INB R2, R3, #0x1 ; Invert bit 1"
    },
    {
        name: "SEB",
        description: "Set a bit in a register using a constant bit index.",
        syntax: "SEB Rd, Rs, #bit",
        example: "SEB R2, R3, #0x2 ; Set bit 2"
    },
    {
        name: "CLB",
        description: "Clear a bit in a register using a constant bit index.",
        syntax: "CLB Rd, Rs, #bit",
        example: "CLB R2, R3, #0x3 ; Clear bit 3"
    },
    {
        name: "SWP",
        description: "Swap the values of two registers (alias for SWAP in some docs).",
        syntax: "SWP Rd, Rs",
        example: "SWP R2, R3 ; Swap R2 and R3"
    },
    {
        name: "XOR",
        description: "Perform a bitwise XOR operation between two registers.",
        syntax: "XOR Rd, Rs, Rt",
        example: "XOR R4, R2, R3 ; Perform R2 XOR R3, store result in R4"
    },
    {
        name: "OR",
        description: "Perform a bitwise OR operation between two registers.",
        syntax: "OR Rd, Rs, Rt",
        example: "OR R4, R2, R3 ; Perform R2 OR R3, store result in R4"
    },
    {
        name: "AND",
        description: "Perform a bitwise AND operation between two registers.",
        syntax: "AND Rd, Rs, Rt",
        example: "AND R4, R2, R3 ; Perform R2 AND R3, store result in R4"
    },
    {
        name: "NOT",
        description: "Perform a bitwise NOT operation on a register.",
        syntax: "NOT Rd, Rs",
        example: "NOT R4, R2 ; Perform NOT operation on R2, store result in R4"
    }
];

// Export the sample instructions for use in the application
export default sampleInstructions;
