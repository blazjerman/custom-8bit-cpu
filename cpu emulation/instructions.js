/*
There is 26 different instructions.
*/

//HLT
function HLT(){
    flags[2] = 1;
}

//Pointer
function INCP(){
    registers[4]++;
}
function SETP(){ //Get poiter locaion to ram
    registers[6] = registers[4];
}

//RAM
function READI(){
    registers[3] = registers[7];
}
function READR(){
    registers[7] = RAM[registers[6]];
}
function READ(index){
    registers[index] = registers[7];
}
function WRITER(){
    RAM[registers[6]] = registers[7];
}
function WRITE(index){
    registers[7] = registers[index];
}

//SP
function readp(){
    const pointer = registers[5];
    registers[8] = SPM[pointer] << 8;
    registers[8] |= SPM[(pointer + 1) & 0xff];
}
function POP(index){
    registers[5] = (registers[5] - 1) & 0xff;
    registers[index] = SPM[registers[5]];
    readp();
}
function PUSH(index){
    SPM[registers[5]] = registers[index];
    registers[5] = (registers[5] + 1) & 0xff;
    readp();
}
function POPR(){
    registers[5] = (registers[5] - 1) & 0xff;
    registers[6] = SPM[registers[5]];
    registers[5] = (registers[5] - 1) & 0xff;
    registers[6] |= SPM[registers[5]] << 8;
    readp();
}
function PUSHP(){
    const pointer = registers[4] - 1; //Needs to be fixed!!!
    
    SPM[registers[5]] = pointer >> 8;
    registers[5] = (registers[5] + 1) & 0xff;
    SPM[registers[5]] = (pointer & 0xff);
    registers[5] = (registers[5] + 1) & 0xff;
    readp();
}

//JMP
function JMP(){
    registers[5] = (registers[5] - 1) & 0xff;
    registers[4] = SPM[registers[5]];
    registers[5] = (registers[5] - 1) & 0xff;
    registers[4] |= SPM[registers[5]] << 8;
    readp();
}
function FJMP(){
    registers[5] -= 2;
    readp();
}
function JIFC(){
    if(flags[0]==1)JMP();
    else FJMP();
}
function JIFZ(){
    if(flags[1]==1)JMP();
    else FJMP();
}
function JIFNC(){
    if(flags[0]!=1)JMP();
    else FJMP();
}
function JIFNZ(){
    if(flags[1]!=1)JMP();
    else FJMP();
}
function JIFCZ(){
    if(flags[0]==1 && flags[1]==1)JMP();
    else FJMP();
}
function JIFNCZ(){
    if(flags[0]!=1 && flags[1]!=1)JMP();
    else FJMP();
}

//Simple arithmetics
function SUM(xIndex,yIndex){
    const value = registers[xIndex] + registers[yIndex];
    flags[0] = (value >> 8) & 0x01;
    flags[1] = (registers[xIndex] === 0);
    registers[xIndex] = value & 0xff;
}
function SUB(xIndex,yIndex){
    const value = registers[xIndex] - registers[yIndex];
    flags[0] = (value >> 8) & 0x01;
    flags[1] = (registers[xIndex] === 0);
    registers[xIndex] = value & 0xff;
}
function SHL(index){
    const value = registers[index] << 1;
    flags[0] = (registers[index] >> 7) & 0x01;
    flags[1] = ((value & 0xff) === 0);
    registers[index] = value & 0xff;
}
function SHR(index){
    const value = registers[index] >> 1;
    flags[0] = registers[index] & 0x01;
    flags[1] = ((value & 0xff) === 0);
    registers[index] = value & 0xff;
}
function AND(xIndex,yIndex){
    const value = registers[xIndex] & registers[yIndex];
    flags[1] = (value === 0);
    registers[xIndex] = value & 0xFF;
}
function OR(xIndex,yIndex){
    const value = registers[xIndex] | registers[yIndex];
    flags[1] = (value === 0);
    registers[xIndex] = value & 0xFF;
}
function XOR(xIndex,yIndex){
    const value = registers[xIndex] ^ registers[yIndex];
    flags[1] = (value === 0);
    registers[xIndex] = value & 0xFF;
}
function NOT(index){
    const value = ~registers[index];
    flags[1] = (value === 0);
    registers[index] = value & 0xFF;
}
function CMP(xIndex,yIndex){
    const value = registers[xIndex] - registers[yIndex];
    flags[0] = (value >> 8) & 0x01;
    flags[1] = (value === 0);
}