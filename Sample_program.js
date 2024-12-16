// Sample_programs.js

// Array of sample ASM programs to showcase functionality
const samplePrograms = [
    {
        name: "Basic Arithmetic Operations",
        code: `
; Program 1: Demonstration of Basic Arithmetic Operations in Assembly
LDL R0, #0x000A       ; Load 10 (decimal) into register R0
LDL R1, #0x0005       ; Load 5 (decimal) into register R1
ADD R2, R0, R1        ; Add contents of R0 and R1, store the result (15) in R2
SUB R3, R0, R1        ; Subtract contents of R1 from R0, store the result (5) in R3
MUL R4, R0, R1        ; Multiply contents of R0 and R1, store the result (50) in R4
DIV R5, R0, R1        ; Divide contents of R0 by R1, store the quotient (2) in R5
HLT                   ; Halt the program
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
LDL R0, #0xAAAA       ; Load 0xAAAA into register R0
LDL R1, #0x5555       ; Load 0x5555 into register R1
XOR R3, R0, R1        ; Perform XOR (bitwise exclusive OR) on R0 and R1
AND R4, R0, R1        ; Perform AND (bitwise AND) on R0 and R1
OR  R5, R0, R1        ; Perform OR (bitwise inclusive OR) on R0 and R1
NOT R6, R0            ; Perform NOT (bitwise complement) on R0
HLT                   ; Halt the program
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
LDL R4, #0x0008       ; Load 0x0008 into register R4
SHL R4                ; Shift the bits in R4 one position to the left
HLT                   ; Halt the program
`
    },
    {
        name: "Load and Store Operations",
        code: `
; Program 6: Demonstration of Load and Store Operations
LDL R0, #0x5          ; Load literal value 5 into register R0
LDL R1, #0x8          ; Load literal value 8 into register R1
LDR R3, R0            ; Load the value from memory pointed by R0 into R3
LDR R4, R1            ; Load the value from memory pointed by R1 into R4
ADD R2, R0, R1        ; Add the values in R0 and R1
STR R7, R5            ; Store the value in R7 into memory at R5
HLT                   ; Halt the program
`
    },
    {
        name: "Stack Operations",
        code: `
; Program 7: Demonstration of Stack Operations
LDL R0, #0x5          ; Load 0x5 into R0
PSH R0                ; Push the value in R0 onto the stack
POP R3                ; Pop the top value from the stack into R3
HLT                   ; Halt the program
`
    }
];

// Export the sample programs for use in the application
export default samplePrograms;
