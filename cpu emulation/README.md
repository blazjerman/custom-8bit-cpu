#Assembler instruction:


###basic:
"HLT": Halt the CPU, stopping further execution of instructions.

"MOVA": Move a value from memory to register A.
"MOVB": Move a value from memory to register B.
"READA": Read a value from register A into memory.
"READB": Read a value from register B into memory.

"POPA": Pop a value from the stack into register A.
"POPB": Pop a value from the stack into register B.
"PUSHA": Push the value in register A onto the stack.
"PUSHB": Push the value in register B onto the stack.
"PUSHP": Push the program counter (PC) onto the stack.

"JMP": Unconditional jump to a specified memory address.
"JIFC": Jump to a specified memory address if the carry flag is set.
"JIFZ": Jump to a specified memory address if the zero flag is set.
"JIFNC": Jump to a specified memory address if the carry flag is not set.
"JIFNZ": Jump to a specified memory address if the zero flag is not set.
"JIFCZ": Jump to a specified memory address if either the carry or zero flag is set.
"JIFNCZ": Jump to a specified memory address if neither the carry nor zero flag is set.

"SUM": Add the values in registers A and B, storing the result in register A.
"SUB": Subtract the value in register B from the value in register A, storing the result in register A.
"NOT": Perform bitwise NOT operation on the value in register A.
"OR": Perform bitwise OR operation between the values in registers A and B, storing the result in register A.
"AND": Perform bitwise AND operation between the values in registers A and B, storing the result in register A.
"XOR": Perform bitwise XOR operation between the values in registers A and B, storing the result in register A.
"SHL": Shift the value in register A left (multiply by 2).
"SHR": Shift the value in register A right (divide by 2).

Conditional operations (to be used before jumping):
    "CSUM"
    "CSUB"
    "CNOT"
    "COR"
    "CAND"
    "CXOR"
    "CSHL"
    "CSHR"


"PUSHR": Push from memory to stack.




###Special stuff:

For jumping to specific location we can use:

loop:
//Code
loop> JMP


The assembler detects the beginning of the // text as a comment.

The screen memory is the same as the main memory and starts at 0xFF00, extending up to 0xFFFF.

Everything else is as you would expect.




###Code example:

Below, we can see an example of code where it draws a cube on the screen, and the cube bounces off the sides.

MOVB 0x11
MOVA 0x15

loop:

PUSHB

PUSHR 0xFF
PUSHA
MOVB 0xFF
READB

PUSHR 0xFF
PUSHA
MOVB 0x00
READB

MOVB 0x0F
CAND
right> JIFZ
rightBack:

MOVB 0x0F
NOT
CAND
left> JIFZ
leftBack:

MOVB 0xF0
CAND
up> JIFZ
upBack:

MOVB 0xF0
NOT
CAND
down> JIFZ
downBack:

POPB
SUM

loop> JMP





right:
  POPB
  PUSHA

  PUSHB POPA
  MOVB 0x02
  SUM
  PUSHA POPB

  POPA
  PUSHB
rightBack> JMP


left:
  POPB
  PUSHA

  PUSHB POPA
  MOVB 0x02
  SUB
  PUSHA POPB

  POPA
  PUSHB
leftBack> JMP




up:
  POPB
  PUSHA

  PUSHB POPA
  MOVB 0x20
  SUB
  PUSHA POPB

  POPA
  PUSHB
upBack> JMP


down:
  POPB
  PUSHA

  PUSHB POPA
  MOVB 0x20
  SUM
  PUSHA POPB

  POPA
  PUSHB
downBack> JMP