; Initialize registers
LDL R0, #0x000A   ; Load 10 (decimal) into R0
LDL R1, #0x0005   ; Load 5 (decimal) into R1

; Arithmetic operations
ADD R2, R0, R1    ; Add R0 and R1, store result in R2 (10 + 5 = 15)
SUB R3, R0, R1    ; Subtract R1 from R0, store result in R3 (10 - 5 = 5)
MUL R4, R0, R1    ; Multiply R0 and R1, store result in R4 (10 * 5 = 50)
DIV R5, R0, R1    ; Divide R0 by R1, store quotient in R5 (10 / 5 = 2)

; Halt the program
HLT






; Initialize registers
LDL R2 #0x5         ; Load the multiplicand (5) into register R2
LDL R3 #0x4         ; Load the multiplier (4) into register R3
LDL R1 #0x0         ; Initialize the result register R1 to 0
LDL R4 #0x1         ; Load the value 1 into register R4 (used for decrementing)
LDL R7 #0x0         ; Load 0 into register R7 (used for comparison)

; Loop to perform multiplication using repeated addition
LOOP:
ADD R1 R1 R2        ; Add the value of R2 (multiplicand) to R1 (accumulate result)
SUB R3 R3 R4        ; Subtract 1 from R3 (decrement the multiplier)
CMP R3 R7          ; Compare R3 with 0 to check if all iterations are done
JNZ LOOP            ; If R3 is not 0, jump back to LOOP for the next iteration
; Halt the program
HLT

; Program 2
LDL R0 #0x0         ; Load the multiplicand (5) into register R2
LDL R1 #0x1         ; Load the multiplier (4) into register R3
LDL R2 #0x2         ; Initialize the result register R1 to 0
LDL R3 #0x4         ; Load the value 1 into register R4 (used for decrementing)
LDL R4 #0x8         ; Load 0 into register R7 (used for comparison)
LDL R5 #0x32         ; Load 0 into register R7 (used for comparison)
SHL R4
SHLC R3 R2 
; Halt the program
HLT


;program3
; Initialize registers
LDL R0, #0xAAAA   ; Load 0xAAAA into R0
LDL R1, #0x5555   ; Load 0x5555 into R1

; Logical operations
XOR R3, R0, R1    ; XOR R0 and R1, store the result in R3
AND R4, R0, R1    ; AND R0 and R1, store the result in R4
OR  R5, R0, R1    ; OR R0 and R1, store the result in R5
NOT R6, R0        ; NOT R0, store the result in R6

; Halt the program
HLT


