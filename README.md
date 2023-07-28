# costum-8bit-cpu


This project is dedicated to building an 8-bit custom processor using discrete transistors. It draws inspiration from Ben Eater, who created an 8-bit CPU (https://eater.net/8bit). The main highlight of this processor is that all operations are executed in a single cycle, enabling a very simple control logic. The processor itself is 8-bit and can access a 16-bit RAM and an 8-bit stack memory that is separate from the RAM. Additionally, it consists of two registers, a simple ALU (Arithmetic Logic Unit), control logic, and other essential components. In the "schematic" folder, you can find the connections of various CPU parts, including a "High-level overview."

The concept of a transistor-based processor: The idea is to design the entire CPU using transistors, although accomplishing this solely with transistors is nearly impossible. As a result, the decision was made to implement everything using transistors except for the RAM and stack pointer. Of course, in addition to transistors, other basic components will be utilized.

In the "cpu emulation" folder, an assembler is provided along with an emulator that showcases the functionality of the processor. I created this to understand the CPU's capabilities in simulation. The emulator includes a 16x16 8-bit RGB screen. More information about using the assembler can be found in the folder itself.