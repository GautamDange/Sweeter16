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


; Program 2
LDL R0 #0x0         ; Load the multiplicand (5) into register R2
LDL R1 #0x1         ; Load the multiplier (4) into register R3
LDL R2 #0x2         ; Initialize the result register R1 to 0
LDL R3 #0x4         ; Load the value 1 into register R4 (used for decrementing)
LDL R4 #0x8         ; Load 0 into register R7 (used for comparison)
LDL R5 #0x32         ; Load 0 into register R7 (used for comparison)
SHL R4
SHLC R3 R2 