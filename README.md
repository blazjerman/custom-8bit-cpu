# custom-8bit-cpu


This project is dedicated to building an 8-bit custom processor using discrete transistors. It draws inspiration from Ben Eater, who created an 8-bit CPU (https://eater.net/8bit). The main highlight of this processor is that all operations are executed in a single cycle, enabling a very simple control logic. The processor itself is 8-bit and can access a 16-bit RAM and an 8-bit stack memory that is separate from the RAM. Additionally, it consists of two registers, a simple ALU (Arithmetic Logic Unit), control logic, and other essential components. In the "schematic" folder, you can find the connections of various CPU parts, including a "High-level overview."

The concept of a transistor-based processor: The idea is to design the entire CPU using transistors, although accomplishing this solely with transistors is nearly impossible. As a result, the decision was made to implement everything using transistors except for the RAM and stack pointer. Of course, in addition to transistors, other basic components will be utilized. RAM and the stack can be emulated with microcontrollers.

In the "cpu emulation" folder, an assembler is provided along with an emulator that showcases the functionality of the processor. I created this to understand the CPU's capabilities in simulation. The emulator includes a 16x16 8-bit RGB screen. More information about using the assembler can be found below.







## Assembler:

### basic instruction:

- HLT: Halt the CPU, stopping further execution of instructions.

- MOVA: Move a value from memory to register A.
- MOVB: Move a value from memory to register B.
- READA: Read a value from register A into memory.
- READB: Read a value from register B into memory.

- POPA: Pop a value from the stack into register A.
- POPB: Pop a value from the stack into register B.
- PUSHA: Push the value in register A onto the stack.
- PUSHB: Push the value in register B onto the stack.
- PUSHP: Push 16-bit program counter (PC) onto the stack.

- PUSHR: Push from memory to stack.

- JMP: Unconditional jump to a specified memory address.
- JIFC: Jump to a specified memory address if the carry flag is set.
- JIFZ: Jump to a specified memory address if the zero flag is set.
- JIFNC: Jump to a specified memory address if the carry flag is not set.
- JIFNZ: Jump to a specified memory address if the zero flag is not set.
- JIFCZ: Jump to a specified memory address if either the carry or zero flag is set.
- JIFNCZ: Jump to a specified memory address if neither the carry nor zero flag is set.

- SUM: Add the values in registers A and B, storing the result in register A.
- SUB: Subtract the value in register B from the value in register A, storing the result in register A.
- NOT: Perform bitwise NOT operation on the value in register A.
- OR: Perform bitwise OR operation between the values in registers A and B, storing the result in register A.
- AND: Perform bitwise AND operation between the values in registers A and B, storing the result in register A.
- XOR: Perform bitwise XOR operation between the values in registers A and B, storing the result in register A.
- SHL: Shift the value in register A left (multiply by 2).
- SHR: Shift the value in register A right (divide by 2).



### Conditional operations (to be used before jumping):

- CSUM
- CSUB
- CNOT
- COR
- CAND
- CXOR
- CSHL
- CSHR







### Special stuff:

For jumping to specific location we can use:

loop:
//Code
loop> JMP


The assembler detects the beginning of the // text as a comment.

The screen memory is the same as the main memory and starts at 0xFF00, extending up to 0xFFFF.

Everything else is as you would expect.




### Code example:

In the "cpu emulation" folder, we can find a code example in the "codeExample.txt" file. This code draws a cube on the screen, and the cube bounces off the sides.

