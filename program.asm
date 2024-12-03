; Load multiplicand and multiplier into registers
LDL R2 #0x5         ; Load multiplicand (5) into R2
LDL R3 #0x4         ; Load multiplier (4) into R3
LDL R1 #0x0         ; Initialize accumulator (result) to 0
LDL R4 #0x1         ; Load constant 1 into R4 (for decrementing R3)

; Loop to perform addition
LOOP:
ADD R1 R1 R2      ; Add R2 to R1 (accumulate the result)
SUB R3 R3 R4      ; Decrement R3 by 1 using R4
JNZ R3 LOOP       ; If R3 != 0, jump back to LOOP
