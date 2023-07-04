/*
Arithmetic logic unit functions (it works only on registers).
There is 26 different functions.
*/

//Basic movement
function MOV(xIndex,yIndex){
    registers[yIndex] = registers[xIndex];
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
    registers[xIndex] = value;
}
function OR(xIndex,yIndex){
    const value = registers[xIndex] | registers[yIndex];
    flags[1] = (value === 0);
    registers[xIndex] = value;
}
function XOR(xIndex,yIndex){
    const value = registers[xIndex] ^ registers[yIndex];
    flags[1] = (value === 0);
    registers[xIndex] = value;
}
function NOT(index){
    const value = ~registers[index];
    flags[1] = (value === 0);
    registers[index] = value;
}
function INC(index){
    const value = registers[index] + 1;
    flags[0] = (value >> 8) & 0x01;
    flags[1] = (registers[index] === 0);
    registers[index] = value & 0xff;
}
function DEC(index){
    const value = registers[index] - 1;
    flags[0] = (value >> 8) & 0x01;
    flags[1] = (registers[index] === 0);
    registers[index] = value & 0xff;
}


//Checking: console.log("C: "+flags[0]+"  Z: "+flags[1]+"  Val: "+(value & 0xff))

//Pointer
function INCP(){
    registers[4]++;
}


//RAM
function READR(){
    registers[7] = RAM[registers[6]];
}
function WRITEP(){
    registers[6] = registers[4];
}
function READI(){
    registers[3] = registers[7];
}
function READ(index){
    registers[index] = registers[7];
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
    SPM[registers[5]] = registers[4] >> 8;
    registers[5] = (registers[5] + 1) & 0xff;
    SPM[registers[5]] = (registers[4] & 0xff);
    registers[5] = (registers[5] + 1) & 0xff;
    readp();
}

//JMP
function JIC(){
    if(flags[0]==1){
        registers[4]+=5;
    }
}
function JIZ(){
    if(flags[1]==1){
        registers[4]+=5;
    }
}
function JICZ(){
    if(flags[0]==1 && flags[1]==1){
        registers[4]+=5;
    }
}
function JINC(){
    if(flags[0]!=1){
        registers[4]+=5;
    }
}
function JINZ(){
    if(flags[1]!=1){
        registers[4]+=5;
    }
}
function JINCZ(){
    if(flags[0]!=1 && flags[1]!=1){
        registers[4]+=5;
    }
}
