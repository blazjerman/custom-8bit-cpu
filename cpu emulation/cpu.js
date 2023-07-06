let SPMSize = 256;       //Divisor of maxMemoryTableHeight (max: 256)
let RAMSize = 65536;    //Divisor of maxMemoryTableHeight (max: 65536)

let tableMemoryWidth = 16;
let maxTableMemoryHeight = 20;

let screenStartIndex = 0;
let screenSize = 16;

let stepFrequency = 1;

const hex = 16;

//Memory
const SPM = new Uint8Array(SPMSize);
const RAM = new Uint8Array(RAMSize);

//Registers
const registersSize  = new Array(   1,      1,      1,      1,      2,      1,      2,      1,    2        ); //In bytes
const registersNames = new Array(  "A",    "B",    "R",    "I",    "P",    "SP",   "RIN",  "ROUT","SPOUT"  );
const registersIdex  = new Array(   0,      1,      2,      3,      5,      4,      6,      8,     7       );
const registers      = new Uint16Array(registersNames.length);

//Flags
const flagsNames = new Array(  "C",    "Z",    "H"  );
const flags      = new Uint8Array(flagsNames.length);

//HTML
const elementSPM = document.getElementById("SPM");
const elementRAM = document.getElementById("RAM");
const elementScreen = document.getElementById("screen");
const elementRegister = document.getElementById("registers");
const elementFlags = document.getElementById("flags");

//HTML updates.
let updateScreen = true;
let updateMemoryReg = true;

//50hz update interval of screen.
setInterval(
    function (){
        if(!updateScreen)return;
        updateScreen = false;
        updateScreeRegs()
    },
20); 


//10hz update interval of memory and regs.
setInterval(
    function (){
        if(!updateMemoryReg)return;
        updateMemoryReg = false;
        updateMemoryRegFlag()
    },
100); 


function updateScreeRegs(){
    //Update Screen
    generateScreen(elementScreen,RAM,screenStartIndex,screenSize,screenSize);   
}

function updateMemoryRegFlag(){
    //Update memory.
    generateMemoryTable(elementSPM,SPM); 
    generateMemoryTable(elementRAM,RAM);
    //Update Regs. and memory pointers.
    generateRegisterTable(elementRegister);
    updatePointerToTableMemory(elementRAM, registers[4],"P");
    updatePointerToTableMemory(elementSPM, registers[5],"SP");
    updatePointerToTableMemory(elementRAM, registers[6],"RIN");
    //Update flags.
    generateFlagTable(elementFlags);
}





SPM[0] = 1;
SPM[1] = 6;

RAM[0] = 1;
RAM[1] = 6;
RAM[2] = 2;
RAM[3] = 4;
RAM[4] = 5;
RAM[5] = 6;
RAM[6] = 4;



function updatePointerToTableMemory(element, index, cl){

    if(element.getElementsByClassName(cl).length!=0){
        element.getElementsByClassName(cl)[0].classList.remove(cl);
    }
    
    if(element.getElementsByClassName("id_"+index).length!=0){
        element.getElementsByClassName("id_"+index)[0].classList.add(cl);
    }

}


//Table generation
function generateMemoryTable(element,memory){

    const height = Math.min(memory.length / tableMemoryWidth, maxTableMemoryHeight);

    let text = '<tr><td></td>';

    for (let j = 0; j < tableMemoryWidth; j++){
        text += '<td>' + byteAsHex(j,getBaseLog(hex, tableMemoryWidth)) + '</td>';
    }
    
    text += '</tr>';

    for (let i = 0; i < height; i++) {
      
        text += '<tr><td>' + byteAsHex(i,getBaseLog(hex, height)) + '</td>';
        
        for (let j = 0; j < tableMemoryWidth; j++) {
            text += '<td class="id_' + (i * tableMemoryWidth + j) + '">' + byteAsHex(memory[(i * tableMemoryWidth + j)],2) + '</td>';
        }

        text += '</tr>';

    }

    element.innerHTML = text;
}

function generateRegisterTable(element){

    let names = '<tr>';
    let values = '<tr>';

    for (let i = 0; i < registers.length; i++) {
        
        let index = registersIdex[i];
        names += '<td>' + registersNames[index] + '</td>';
        values += '<td class="' + registersNames[index] + '">' + byteAsHex(registers[index],registersSize[index]*2) + '</td>';
    }

    element.innerHTML = names + '</tr>' + values + '</tr>';
}

function generateFlagTable(element){
    
    let namesText = "";
    let flagsText = "<br>";

    for (let i = 0; i < flagsNames.length; i++){
        namesText += flagsNames[i] + " ";
        flagsText += flags[i] + " ";
    }

    element.innerHTML = namesText + flagsText;
}


function byteAsHex(byte,size){
    return byte.toString(hex).padStart(size, '0').toUpperCase();
}

function getBaseLog(x, y) {
    return Math.log(y) ** (1 / x);
  }

//Screen

function generateScreen(element,memory,start,x,y){

    let text = "";

    let index = start;

    for (let i = 0; i < x; i++) {
      
        text += '<tr>';
        
        for (let j = 0; j < y; j++) {

            text += '<td class="id_' + index + '" style="background-color: ' + get32ColorFrom8(memory[index]) + '"></td>';
            index++;

        }

        text += '</tr>';

    }

    element.innerHTML = text;
}

function get32ColorFrom8(color){
    const r = Math.round(((color>>5)/7)*255);
    const g = Math.round((((color>>2)&7)/7)*255);
    const b = Math.round(((color&3)/3)*255);
    return "rgb("+ r + ", " + g + ", " + b + ")"
}







//assemble for cpu
function assembleCode(){
    let code = getFilteredCodeText();
    console.log(code);
}



//Commands
function command(name){

    if(!isNaN(parseInt(name))){
        addToRam(parseInt(name));
        return;
    }

    switch(name) {
        case "MOV A B":
            addToRam(1);return;
        case "MOV B A":
            addToRam(2);return;
        case "MOV A R":
            addToRam(3);return;
      }

}


function addToRam(value){
    for (let i = 0; i < RAM.length; i++) {
        if(RAM[i] == 0){
            setRandomAccesMemory(i,value);
            break;
        }
    }
}










//Instruction execution


//Frequency control

let indexStep = 0; //4 are needed for one instruction (two cycles)
let running;

function run(){
        
    const timesPerInterval = Math.ceil(stepFrequency / 1000);
    const interval = stepFrequency <= 1000? 1 / stepFrequency * 1000 : 1;
    
    running = setInterval(
        function () {
            for (let i = 0; i < timesPerInterval; i++){
                singleStep();
            }
        },
    interval);
}


function singleStep(){ 
    switch(indexStep) {
        case 0:
            WRITEP();  //Copy P in RIN
            READR();   //Get ROUT from RIN
            break;
        case 1:
            READI();   //Copy ROUT in I
            INCP();    //Increase P
            break;
        case 2:
            WRITEP();  //Copy P in RIN
            READR();   //Get ROUT from RIN
            break;
        case 3:
            exicuteCommand();   //Execute instruction from I (exicuteCommand will Increase P if its needed.)
    }

    updateScreen = true;
    updateMemoryReg = true;
    
    indexStep++;
    if(indexStep==4)indexStep=0;
}


function exicuteCommand(){

    switch(registers[3]) {
        case 1:
            READ(0);//Premakni iz rama v A
            INCP();//Povečaj P
            break;
        case 2:
            READ(1);//Premakni iz rama v B
            INCP();//Povečaj P
            break;
        case 3:
            RAM[registers[1]] = registers[0];//Kopira A v RAM glede na poiter B-ja
            break;
        case 4:
            registers[4] = registers[1];//Kopira B v P
            break;
        case 5:
            INC(0);//Povečaj A
            break;
        case 6:
            RAM[registers[0]] = registers[0];//Kopira A v RAM glede na poiter A-ja (kr neki)
            break;
      }
}

function exicuteCommandTest(value){
    switch(value) {
        
              case 2:MOV(0,1);
        break;case 3:SUM(0,1);
        break;case 4:SUB(0,1);
        break;case 5:SHL(0);
        break;case 6:SHR(0);
        break;case 7:AND(0,1);
        break;case 8:OR(0,1);
        break;case 9:XOR(0,1);
        break;case 10:NOT(0);
        break;case 11:INC(0);
        break;case 12:DEC(0);
        break;case 13:INCP();
        break;case 14:READR();
        break;case 15:WRITEP();
        break;case 16:READI();
        break;case 17:READ(0);
        break;case 18:POP(0);
        break;case 19:PUSH(0);
        break;case 20:POPR();
        break;case 21:PUSHP();
        break;case 22:JIC();
        break;case 23:JIZ();
        break;case 24:JICZ();
        break;case 25:JINC();
        break;case 26:JINZ();
        break;case 27:JINCZ();
    }
}


/*
MOV(0,1
SUM(0,1
SUB();b
SHL();b
SHR();b
AND();b
OR();br
XOR();b
NOT();b
INC();b
DEC();b
INCP();
READR()
WRITEP(
READI()
READ();
POP();b
PUSH();
POPR();
PUSHP()
JIC();b
JIZ();b
JICZ();
JINC();
JINZ();
JINCZ()
*/