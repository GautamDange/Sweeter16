
Program 1: Basic Arithmetic Operations

; ===== Initialize Registers =====
LDL R0, #0x000A       ; Load 10 (decimal) into R0
LDL R1, #0x0005       ; Load 5 (decimal) into R1

; ===== Arithmetic Operations =====
ADD R2, R0, R1        ; Add R0 and R1, store result in R2 (10 + 5 = 15)
SUB R3, R0, R1        ; Subtract R1 from R0, store result in R3 (10 - 5 = 5)
MUL R4, R0, R1        ; Multiply R0 and R1, store result in R4 (10 * 5 = 50)
DIV R5, R0, R1        ; Divide R0 by R1, store quotient in R5 (10 / 5 = 2)

; ===== End Program =====
HLT                   ; Halt the program



; =====
Program 2: Multiplication Using Repeated Addition

; ===== Initialize Registers =====
LDL R2, #0x5          ; Load the multiplicand (5) into register R2
LDL R3, #0x4          ; Load the multiplier (4) into register R3
LDL R1, #0x0          ; Initialize the result register R1 to 0
LDL R4, #0x1          ; Load the value 1 into register R4 (used for decrementing)
LDL R7, #0x0          ; Load 0 into register R7 (used for comparison)

; ===== Multiplication Loop =====
LOOP:
    ADD R1, R1, R2    ; Add R2 (multiplicand) to R1 (accumulate result)
    SUB R3, R3, R4    ; Subtract 1 from R3 (decrement the multiplier)
    CMP R3, R7        ; Compare R3 with 0 to check if all iterations are done
    JNZ LOOP          ; If R3 is not 0, jump back to LOOP for the next iteration

; ===== End Program =====
HLT                   ; Halt the program


; =====
Program 3: Logical Operations

; ===== Initialize Registers =====
LDL R0, #0xAAAA       ; Load 0xAAAA into R0
LDL R1, #0x5555       ; Load 0x5555 into R1

; ===== Logical Operations =====
XOR R3, R0, R1        ; XOR R0 and R1, store the result in R3
AND R4, R0, R1        ; AND R0 and R1, store the result in R4
OR  R5, R0, R1        ; OR R0 and R1, store the result in R5
NOT R6, R0            ; NOT R0, store the result in R6

; ===== End Program =====
HLT                   ; Halt the program
; =====


Here are the decorated and well-commented versions of your assembly programs, organized for clarity and professional sharing:

Program 1: Basic Arithmetic Operations
asm
Copy code
; ===== Initialize Registers =====
LDL R0, #0x000A       ; Load 10 (decimal) into R0
LDL R1, #0x0005       ; Load 5 (decimal) into R1

; ===== Arithmetic Operations =====
ADD R2, R0, R1        ; Add R0 and R1, store result in R2 (10 + 5 = 15)
SUB R3, R0, R1        ; Subtract R1 from R0, store result in R3 (10 - 5 = 5)
MUL R4, R0, R1        ; Multiply R0 and R1, store result in R4 (10 * 5 = 50)
DIV R5, R0, R1        ; Divide R0 by R1, store quotient in R5 (10 / 5 = 2)

; ===== End Program =====
HLT                   ; Halt the program
Program 2: Multiplication Using Repeated Addition
asm
Copy code
; ===== Initialize Registers =====
LDL R2, #0x5          ; Load the multiplicand (5) into register R2
LDL R3, #0x4          ; Load the multiplier (4) into register R3
LDL R1, #0x0          ; Initialize the result register R1 to 0
LDL R4, #0x1          ; Load the value 1 into register R4 (used for decrementing)
LDL R7, #0x0          ; Load 0 into register R7 (used for comparison)

; ===== Multiplication Loop =====
LOOP:
    ADD R1, R1, R2    ; Add R2 (multiplicand) to R1 (accumulate result)
    SUB R3, R3, R4    ; Subtract 1 from R3 (decrement the multiplier)
    CMP R3, R7        ; Compare R3 with 0 to check if all iterations are done
    JNZ LOOP          ; If R3 is not 0, jump back to LOOP for the next iteration

; ===== End Program =====
HLT                   ; Halt the program
Program 3: Logical Operations
asm
Copy code
; ===== Initialize Registers =====
LDL R0, #0xAAAA       ; Load 0xAAAA into R0
LDL R1, #0x5555       ; Load 0x5555 into R1

; ===== Logical Operations =====
XOR R3, R0, R1        ; XOR R0 and R1, store the result in R3
AND R4, R0, R1        ; AND R0 and R1, store the result in R4
OR  R5, R0, R1        ; OR R0 and R1, store the result in R5
NOT R6, R0            ; NOT R0, store the result in R6

; ===== End Program =====
HLT                   ; Halt the program
Program 4: Conditional Jump and Subroutine Example

; ===== Initialize Registers =====
LDL R0, #0x0005       ; Load 5 into R0
LDL R1, #0x0005       ; Load 5 into R1
LDL R2, #0x000A       ; Load 10 into R2

; ===== Conditional Comparison =====
CMP R0, R1            ; Compare R0 and R1
JZ EQUAL_LABEL        ; Jump to EQUAL_LABEL if R0 == R1
JNZ NOT_EQUAL_LABEL   ; Jump to NOT_EQUAL_LABEL if R0 != R1

; ===== Subroutine Example =====
JS ADD_SUBROUTINE     ; Jump to subroutine to add R0 and R2
RTS                   ; Return from subroutine

EQUAL_LABEL:
    LDL R3, #0x1111   ; Load 0x1111 into R3 (if R0 == R1)
    HLT               ; Halt the program

NOT_EQUAL_LABEL:
    LDL R3, #0x2222   ; Load 0x2222 into R3 (if R0 != R1)
    HLT               ; Halt the program

ADD_SUBROUTINE:
    ADD R4, R0, R2    ; Add R0 and R2, store the result in R4
    RTS               ; Return from the subroutine



Program 5: Shift and Rotate Operations
; ===== Initialize Registers =====
LDL R0, #0x0000       ; Load 0x0000 into R0
LDL R1, #0x0001       ; Load 0x0001 into R1
LDL R2, #0x0002       ; Load 0x0002 into R2
LDL R3, #0x0004       ; Load 0x0004 into R3
LDL R4, #0x0008       ; Load 0x0008 into R4
LDL R5, #0x0032       ; Load 0x0032 into R5

; ===== Shift and Rotate Operations =====
SHL R4                ; Shift left R4
SHLC R3, R2           ; Shift left with carry R3 and R2

; ===== End Program =====
HLT                   ; Halt the program
