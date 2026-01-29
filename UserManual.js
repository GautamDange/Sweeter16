// User Manual for SWEETER16 Processor Simulator
const UserManual = `
# SWEETER16 Processor Simulator - User Manual

## Introduction
The SWEETER16 Processor Simulator is a tool designed to help users understand and simulate the functionality of a 16-bit processor. It allows you to input assembly code, execute instructions step-by-step, and view the internal state of registers, memory, and stack in real time.

## Key Features
1. Input Assembly Code: Paste your assembly code into the provided text area.
2. Instruction Execution: Execute instructions one at a time or load predefined sample programs.
3. Memory Management: Update memory dynamically with hexadecimal values.
4. Real-Time Visualization: Monitor changes in registers, memory, and stack dynamically.
5. Instruction Set Support: Supports arithmetic, logic, control flow, and memory instructions.

## Quick Start
1. Loading a Program:
   - Paste your assembly code into the "Input ASM" textarea.
   - Click on the "Convert" button to parse the code.

2. Executing Instructions:
   - Use the "Run Next" button to execute one instruction at a time.
   - The results are reflected in registers, memory, and the stack in real time.

3. Updating Memory:
   - Enter a memory address and content in the format "ADDRESS:CONTENT" (e.g., "0008:0010") in the "Dynamic Memory" input field.
   - Click the "Add Memory Content" button to update the memory.

4. Viewing Registers and Stack:
   - The current values of all registers (R0 to R7) are displayed dynamically.
   - The stack contents are updated after each stack operation (e.g., PUSH, POP).

## Tabs and Content
1. Sample Programs:
   - Click on the "Sample Programs" tab to view example assembly programs for learning.
   - Copy and paste the sample programs into the input field to simulate them.

2. Instruction Set:
   - Click on the "Instruction Set" tab to view supported instructions, their syntax, and examples.

3. User Manual:
   - Click on the "User Manual" tab to view this guide.
`;

// Expose to the UI code (script.js reads window.UserManual)
window.UserManual = UserManual;
