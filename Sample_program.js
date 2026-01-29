// Sample_programs.js

// Array of sample ASM programs to showcase functionality
const samplePrograms = [
    {
        name: "Basic Arithmetic Operations",
        code: `
; Program: Arithmetic Operations Demonstration
LDL R2, #0x0100       ; Load 0x0100 (256 in decimal) into R2
LDL R3, #0xEFFF       ; Load 0xEFFF (61,439 in decimal) into R3
LDL R4, #0x3333       ; Load 0x3333 (13,059 in decimal) into R4
LDL R5, #0x0010       ; Load 0x0010 (16 in decimal) into R5
LDL R6, #0x0002       ; Load 0x0002 (2 in decimal) into R6
MUL R7, R2, R5        ; Multiply R2 and R5, store the result in R7
ADD R7, R7, R3        ; Add R7 and R3, store the result in R7
SUB R7, R7, R4        ; Subtract R4 from R7, store the result in R7
DIV R7, R7, R6        ; Divide R7 by R6, store the result in R7
HLT                   ; Halt execution
`
    },
    {
        name: "Multiplication Using Repeated Addition",
        code: `
; Program 2: Multiplication Using Repeated Addition (Loop-Based Implementation)
LDL R2, #0x5          ; Load the multiplicand (5) into register R2
LDL R3, #0x4          ; Load the multiplier (4) into register R3
LDL R5, #0x0          ; Initialize the result register R5 to 0 (used to accumulate the result)
LDL R4, #0x1          ; Load the value 1 into register R4 (used for decrementing R3)
LDL R7, #0x0          ; Load 0 into register R7 (used for comparison with R3)
LOOP:
    ADD R5, R5, R2    ; Add the multiplicand (R2) to the result (R5)
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
LDL R2, #0xAAAA       ; Load 0xAAAA into R2
LDL R3, #0x5555       ; Load 0x5555 into R3
OR R6, R2, R3         ; Perform R2 OR R3, store the result in R6
AND R7, R2, R3        ; Perform R2 AND R3, store the result in R7

LDL R4, #0x3333       ; Load 0x3333 into R4
LDL R5, #0x4444       ; Load 0x4444 into R5
XOR R2, R4, R5        ; Perform R4 XOR R5, store the result in R2
NOT R3, R4            ; Perform NOT operation on R4, store the result in R3
HLT                   ; Halt execution
Summary Table (Bitwise Breakdown):
R6	OR	(AAAAH)	1010 1010 1010 1010	(5555H)	0101 0101 0101 0101	(FFFFH)	1111 1111 1111 1111
R7	AND	(AAAAH)	1010 1010 1010 1010	(5555H)	0101 0101 0101 0101	(0000H)	0000 0000 0000 0000
R2	XOR	(3333H)	0011 0011 0011 0011	(4444H)	0100 0100 0100 0100	(7777H)	0111 0111 0111 0111
R3	NOT	(3333H)	0011 0011 0011 0011	(CCCCH) 1100 1100 1100 1100
`
    },
    {
        name: "Conditional Jumps and Subroutine",
        code: `
; Program 4: Conditional Jumps and Subroutine Example in Assembly
LDL R2, #0x0005       ; Load 5 into register R2
LDL R3, #0x0005       ; Load 5 into register R3
LDL R4, #0x000A       ; Load 10 into register R4
CMP R2, R3            ; Compare the values in R2 and R3
JZ EQUAL_LABEL        ; Jump to EQUAL_LABEL if R2 equals R3
JNZ NOT_EQUAL_LABEL   ; Jump to NOT_EQUAL_LABEL if R2 does not equal R3
JS ADD_SUBROUTINE     ; Jump to ADD_SUBROUTINE to perform addition
RTS                   ; Return from the subroutine
EQUAL_LABEL:
    LDL R5, #0x1111   ; Load 0x1111 into R5 if R2 equals R3
    HLT               ; Halt the program
NOT_EQUAL_LABEL:
    LDL R5, #0x2222   ; Load 0x2222 into R5 if R2 does not equal R3
    HLT               ; Halt the program
ADD_SUBROUTINE:
    ADD R6, R2, R4    ; Add the values in R2 and R4
    RTS               ; Return from the subroutine
`
    },
    {
        name: "Shift and Rotate Operations",
        code: `
; Program 5: Demonstration of Shift and Rotate Operations
; Program: Demonstration of Shift and Rotate Operations
; Values Used: 3333H, 5555H, 6666H
; Load the value 3333H into R2 and perform a left shift
LDL R2, #0x3333       ; Load 3333H into R2
SHL R2                ; Shift the value in R2 left by one bit
; Load the value 5555H into R3 and perform a right shift
LDL R3, #0x5555       ; Load 5555H into R3
SHR R3                ; Shift the value in R3 right by one bit
; Load the value 6666H into R4 and perform a left rotate
LDL R4, #0x6666       ; Load 6666H into R4
ROL R4                ; Rotate the value in R4 left by one bit
; Load the value 3333H into R5 and perform a right rotate
LDL R5, #0x3333       ; Load 3333H into R5
ROR R5                ; Rotate the value in R5 right by one bit
; End of Program
HLT                   ; Halt execution
Summary Table:
Register	Operation	Initial (Hex)	Initial (Binary)	Result (Hex)	Result (Binary)
R2	SHL	3333H	0011 0011 0011 0011	6666H	0110 0110 0110 0110
R3	SHR	5555H	0101 0101 0101 0101	2AAAH	0010 1010 1010 1010
R4	ROL	6666H	0110 0110 0110 0110	CCCCH	1100 1100 1100 1100
R5	ROR	3333H	0011 0011 0011 0011	9999H	1001 1001 1001 1001
`
    },
    {
        name: "Load and Store Operations",
        code: `
; Program 6: Demonstration of Load and Store Operations
LDL R2, #0x5          ; Load literal address 5 into register R2.
LDR R3, R2            ; Load the value from the memory address pointed to by R2 into R3.
LDL R4, #0x6          ; Load literal address 6 into register R4.
LDR R5, R4            ; Load the value from the memory address pointed to by R4 into R5.
STR R5, R2            ; Store the value in R5 into the memory address pointed to by R2.
STO R3, 0x6           ; Store the value in R3 into the memory address 0x0006.
`
    },
    {
        name: "Stack Operations",
        code: `
; Program 7: Demonstration of Stack Operations
LDL R2, #0x5          ; Load the literal value 0x5 into register R2.
LDL R3, #0x10         ; Load the literal value 0x10 into register R3.
PSH R2                ; Push the value in R2 (0x5) onto the stack.
PSH R3                ; Push the value in R3 (0x10) onto the stack.
POP R3                ; Pop the top value from the stack (0x10) into R3.
POP R4                ; Pop the next value from the stack (0x5) into R4.
HLT                   ; Halt the program execution.

`
    }
];

// Export the sample programs for use in the application
export default samplePrograms;
