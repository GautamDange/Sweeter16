;Program 1: Demonstration of Basic Arithmetic Operations in Assembly
;  Initialize Registers with Example Values
LDL R0, #0x000A       ; Load 10 (decimal) into register R0
LDL R1, #0x0005       ; Load 5 (decimal) into register R1
;  Perform Arithmetic Operations
ADD R2, R0, R1        ; Add contents of R0 and R1, store the result (15) in R2
SUB R3, R0, R1        ; Subtract contents of R1 from R0, store the result (5) in R3
MUL R4, R0, R1        ; Multiply contents of R0 and R1, store the result (50) in R4
DIV R5, R0, R1        ; Divide contents of R0 by R1, store the quotient (2) in R5
;  Terminate Program
HLT                   ; Halt the program






;Program 2: Multiplication Using Repeated Addition (Loop-Based Implementation)
;  Initialize Registers with Multiplicand and Multiplier
LDL R2, #0x5          ; Load the multiplicand (5) into register R2
LDL R3, #0x4          ; Load the multiplier (4) into register R3
LDL R1, #0x0          ; Initialize the result register R1 to 0 (used to accumulate the result)
LDL R4, #0x1          ; Load the value 1 into register R4 (used for decrementing R3)
LDL R7, #0x0          ; Load 0 into register R7 (used for comparison with R3)
;  Perform Multiplication Using a Loop
LOOP:
    ADD R1, R1, R2    ; Add the multiplicand (R2) to the result (R1)
    SUB R3, R3, R4    ; Decrement the multiplier (R3) by 1
    CMP R3, R7        ; Check if the multiplier (R3) has reached 0
    JNZ LOOP          ; If R3 is not 0, repeat the loop
;  Terminate Program
HLT                   ; Halt the program





; Program 3: Multiplication Using Repeated Addition in Assembly
;  Initialize Registers with Multiplicand and Multiplier
LDL R2, #0x5          ; Load the multiplicand (5) into register R2
LDL R3, #0x4          ; Load the multiplier (4) into register R3
LDL R1, #0x0          ; Initialize the result register R1 to 0 (used to accumulate the result)
LDL R4, #0x1          ; Load the value 1 into register R4 (used to decrement the multiplier)
LDL R7, #0x0          ; Load 0 into register R7 (used as a comparison value)
;  Perform Multiplication Using a Loop
LOOP:
    ADD R1, R1, R2    ; Add the multiplicand (R2) to the result (R1)
    SUB R3, R3, R4    ; Decrement the multiplier (R3) by 1
    CMP R3, R7        ; Check if the multiplier (R3) has reached 0
    JNZ LOOP          ; If R3 is not 0, repeat the loop
;  Terminate Program
HLT                   ; Halt the program






; Program 4: Logical Operations Demonstration in Assembly
;  Initialize Registers with Example Values
LDL R0, #0xAAAA       ; Load 0xAAAA (binary: 1010101010101010) into register R0
LDL R1, #0x5555       ; Load 0x5555 (binary: 0101010101010101) into register R1
;  Perform Logical Operations
XOR R3, R0, R1        ; Perform XOR (bitwise exclusive OR) on R0 and R1, store the result in R3
AND R4, R0, R1        ; Perform AND (bitwise AND) on R0 and R1, store the result in R4
OR  R5, R0, R1        ; Perform OR (bitwise inclusive OR) on R0 and R1, store the result in R5
NOT R6, R0            ; Perform NOT (bitwise complement) on R0, store the result in R6
;  Terminate Program
HLT                   ; Halt the program




; Program 5: Conditional Jumps and Subroutine Example in Assembly
;  Initialize Registers with Example Values
LDL R0, #0x0005       ; Load 5 into register R0
LDL R1, #0x0005       ; Load 5 into register R1
LDL R2, #0x000A       ; Load 10 into register R2
;  Perform Conditional Comparison
CMP R0, R1            ; Compare the values in R0 and R1
JZ EQUAL_LABEL        ; Jump to EQUAL_LABEL if R0 equals R1
JNZ NOT_EQUAL_LABEL   ; Jump to NOT_EQUAL_LABEL if R0 does not equal R1
;  Call Subroutine Example
JS ADD_SUBROUTINE     ; Jump to ADD_SUBROUTINE to perform addition
RTS                   ; Return from the subroutine to continue execution
EQUAL_LABEL:
    LDL R3, #0x1111   ; Load 0x1111 into R3 if R0 equals R1
    HLT               ; Halt the program
NOT_EQUAL_LABEL:
    LDL R3, #0x2222   ; Load 0x2222 into R3 if R0 does not equal R1
    HLT               ; Halt the program
ADD_SUBROUTINE:
    ADD R4, R0, R2    ; Add the values in R0 and R2, store the result in R4
    RTS               ; Return from the subroutine to the calling location





; Program 6: Demonstration of Shift and Rotate Operations in Assembly
;  Initialize Registers with Example Values
LDL R0, #0x0000       ; Load 0x0000 into register R0
LDL R1, #0x0001       ; Load 0x0001 into register R1
LDL R2, #0x0002       ; Load 0x0002 into register R2
LDL R3, #0x0004       ; Load 0x0004 into register R3
LDL R4, #0x0008       ; Load 0x0008 into register R4
LDL R5, #0x0032       ; Load 0x0032 (50 in decimal) into register R5
;  Perform Shift and Rotate Operations
SHL R4                ; Shift the bits in R4 one position to the left (logical shift)
SHLC R3, R2           ; Shift the bits in R3 to the left with carry, updating R2 with carry bits
;  Terminate Program
HLT                   ; Halt the program





; Program 7: Demonstration of Load and Store Operations in Assembly
;  Initialize Registers with Literal Values
LDL R0, #0x5     ; Load literal value 5 into register R0
LDL R1, #0x8     ; Load literal value 8 into register R1
;  Perform Load Operations
LDR R3, R0       ; Load the value from the memory address pointed to by R0 into R3
LDR R4, R1       ; Load the value from the memory address pointed to by R1 into R4
;  Perform Arithmetic Operations
ADD R2, R0, R1   ; Add the values in R0 and R1, store the result in R2
ADD R5, R2, R3   ; Add the values in R2 and R3, store the result in R5
;  Store Operation
LDL R7, #0xA     ; Load literal value 10 into register R7
STR R7, R5       ; Store the value in R7 into the memory address pointed to by R5






; Program 8: Demonstration of Stack Operations in Assembly
;  Initialize Registers and Push Values onto the Stack
LDL R0, #0x5    ; Load immediate value 0x5 into register R0
PSH R0          ; Push the value in R0 (0x5) onto the stack
LDL R1, #0xA    ; Load immediate value 0xA into register R1
PSH R1          ; Push the value in R1 (0xA) onto the stack
LDL R2, #0xF    ; Load immediate value 0xF into register R2
PSH R2          ; Push the value in R2 (0xF) onto the stack
;  Pop Values from the Stack into Registers
POP R3          ; Pop the top value from the stack into register R3 (expected: 0xF)
POP R4          ; Pop the next value from the stack into register R4 (expected: 0xA)
POP R5          ; Pop the next value from the stack into register R5 (expected: 0x5)
;  Terminate Program
HLT             ; Halt the program



