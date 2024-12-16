// Sample_programs.js

// Array of sample ASM programs to showcase functionality
const samplePrograms = [
    {
        name: "Addition Program",
        code: `
LDL R0, #0x5      ; Load 5 into R0
LDL R1, #0xA      ; Load 10 into R1
ADD R2, R0, R1    ; Add R0 and R1, store result in R2
HLT               ; Halt the program
`
    },
    {
        name: "Subtraction Program",
        code: `
LDL R0, #0xF      ; Load 15 into R0
LDL R1, #0x6      ; Load 6 into R1
SUB R2, R0, R1    ; Subtract R1 from R0, store result in R2
HLT               ; Halt the program
`
    },
    {
        name: "Loop Example",
        code: `
LDL R0, #0x0      ; Initialize counter to 0
LDL R1, #0x5      ; Set loop limit to 5
LOOP:
ADD R0, R0, #0x1  ; Increment counter
CMP R0, R1        ; Compare counter with limit
JNZ LOOP          ; Jump back to LOOP if not zero
HLT               ; Halt the program
`
    }
];

// Export the sample programs for use in the application
export default samplePrograms;