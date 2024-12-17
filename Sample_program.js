// Sample_programs.js

// Array of sample ASM programs to showcase functionality
const samplePrograms = [
    {
        name: "Basic Arithmetic Operations",
        code: `
; Program: Arithmetic Operations Demonstration
LDL R0, #0x0100       ; Load 0x0100 (256 in decimal) into R0
LDL R1, #0xEFFF       ; Load 0xEFFF (61,439 in decimal) into R1
LDL R2, #0x3333       ; Load 0x3333 (13,059 in decimal) into R2
LDL R3, #0x0010       ; Load 0x000F (15 in decimal) into R3
LDL R4, #0x0002       ; Load 0x0002 (2 in decimal) into R4
MUL R5, R0, R3        ; Multiply R0 and R3, store the result in R5
ADD R6, R5, R1        ; Add R5 and R1, store the result in R6
SUB R7, R6, R2        ; Subtract R2 from R6, store the result in R7
DIV R3, R7, R4        ; Divide R7 by R4, store the result in R3
HLT                   ; Halt execution
`
    },
    {
        name: "Multiplication Using Repeated Addition",
        code: `
; Program 2: Multiplication Using Repeated Addition (Loop-Based Implementation)
LDL R2, #0x5          ; Load the multiplicand (5) into register R2
LDL R3, #0x4          ; Load the multiplier (4) into register R3
LDL R1, #0x0          ; Initialize the result register R1 to 0 (used to accumulate the result)
LDL R4, #0x1          ; Load the value 1 into register R4 (used for decrementing R3)
LDL R7, #0x0          ; Load 0 into register R7 (used for comparison with R3)
LOOP:
    ADD R1, R1, R2    ; Add the multiplicand (R2) to the result (R1)
    SUB R3, R3, R4    ; Decrement the multiplier (R3) by 1
    CMP R3, R7        ; Check if the multiplier (R3) has reached 0
    JNZ LOOP          ; If R3 is not 0, repeat the loop
HLT                   ; Halt the program
`
    },
    {
        name: "Logical Operations Demonstration",
        code: `
; Program 3: Logical Operations Demonstration in Assembly
LDL R0, #0xAAAA       ; Load 0xAAAA into R0
LDL R1, #0x5555       ; Load 0x5555 into R1
LDL R2, #0x3333       ; Load 0x3333 into R2
LDL R3, #0x4444       ; Load 0x4444 into R3
OR R4, R0, R1         ; Perform R0 OR R1, store the result in R4
AND R5, R0, R1        ; Perform R0 AND R1, store the result in R5

XOR R6, R2, R3        ; Perform R2 XOR R3, store the result in R7
NOT R7, R2            ; Perform NOT operation on R2, store the result in R6
HLT                   ; Halt execution
Summary Table (Bitwise Breakdown):
R4	OR	(AAAAH)	1010 1010 1010 1010	(5555H)	0101 0101 0101 0101	(FFFFH)	1111 1111 1111 1111
R5	AND	(AAAAH)	1010 1010 1010 1010	(5555H)	0101 0101 0101 0101	(0000H)	0000 0000 0000 0000
R6	XOR	(3333H)	0011 0011 0011 0011	(4444H)	0100 0100 0100 0100	(7777H)	0111 0111 0111 0111
R7	NOT	(3333H)	0011 0011 0011 0011	(CCCCH) 1100 1100 1100 1100
`
    },
    {
        name: "Conditional Jumps and Subroutine",
        code: `
; Program 4: Conditional Jumps and Subroutine Example in Assembly
LDL R0, #0x0005       ; Load 5 into register R0
LDL R1, #0x0005       ; Load 5 into register R1
LDL R2, #0x000A       ; Load 10 into register R2
CMP R0, R1            ; Compare the values in R0 and R1
JZ EQUAL_LABEL        ; Jump to EQUAL_LABEL if R0 equals R1
JNZ NOT_EQUAL_LABEL   ; Jump to NOT_EQUAL_LABEL if R0 does not equal R1
JS ADD_SUBROUTINE     ; Jump to ADD_SUBROUTINE to perform addition
RTS                   ; Return from the subroutine
EQUAL_LABEL:
    LDL R3, #0x1111   ; Load 0x1111 into R3 if R0 equals R1
    HLT               ; Halt the program
NOT_EQUAL_LABEL:
    LDL R3, #0x2222   ; Load 0x2222 into R3 if R0 does not equal R1
    HLT               ; Halt the program
ADD_SUBROUTINE:
    ADD R4, R0, R2    ; Add the values in R0 and R2
    RTS               ; Return from the subroutine
`
    },
    {
        name: "Shift and Rotate Operations",
        code: `
; Program 5: Demonstration of Shift and Rotate Operations
; Program: Demonstration of Shift and Rotate Operations
; Values Used: 3333H, 5555H, 6666H
; Load the value 3333H into R0 and perform a left shift
LDL R0, #0x3333       ; Load 3333H into R0
SHL R0                ; Shift the value in R0 left by one bit
; Load the value 5555H into R1 and perform a right shift
LDL R1, #0x5555       ; Load 5555H into R1
SHR R1                ; Shift the value in R1 right by one bit
; Load the value 6666H into R2 and perform a left rotate
LDL R2, #0x6666       ; Load 6666H into R2
ROL R2                ; Rotate the value in R2 left by one bit
; Load the value 3333H into R3 and perform a right rotate
LDL R3, #0x3333       ; Load 3333H into R3
ROR R3                ; Rotate the value in R3 right by one bit
; End of Program
HLT                   ; Halt execution
Summary Table:
Register	Operation	Initial (Hex)	Initial (Binary)	Result (Hex)	Result (Binary)
R0	SHL	3333H	0011 0011 0011 0011	6666H	0110 0110 0110 0110
R1	SHR	5555H	0101 0101 0101 0101	2AAAH	0010 1010 1010 1010
R2	ROL	6666H	0110 0110 0110 0110	CCCCH	1100 1100 1100 1100
R3	ROR	3333H	0011 0011 0011 0011	9999H	1001 1001 1001 1001
`
    },
    {
        name: "Load and Store Operations",
        code: `
; Program 6: Demonstration of Load and Store Operations
LDL R0, #0x5          ; Load literal value 5 into register R0.
LDR R1, R0            ; Load the value from the memory address pointed to by R0 into R1.
LDL R2, #0x6          ; Load literal value 6 into register R2.
LDR R3, R2            ; Load the value from the memory address pointed to by R2 into R3.
STR R3, R0            ; Store the value in R3 into the memory address pointed to by R0.
STO R1, 0x6           ; Store the value in R1 into the memory address 0x6.
`
    },
    {
        name: "Stack Operations",
        code: `
; Program 7: Demonstration of Stack Operations
LDL R0, #0x5          ; Load the literal value 0x5 into register R0.
LDL R1, #0x10         ; Load the literal value 0x10 into register R1.
PSH R0                ; Push the value in R0 (0x5) onto the stack.
PSH R1                ; Push the value in R1 (0x10) onto the stack.
POP R3                ; Pop the top value from the stack (0x10) into R3.
POP R4                ; Pop the next value from the stack (0x5) into R4.
HLT                   ; Halt the program execution.

`
    }
];

// Export the sample programs for use in the application
export default samplePrograms;
