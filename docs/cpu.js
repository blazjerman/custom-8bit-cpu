let SPMSize = 256;       //Divisor of maxMemoryTableHeight (max: 256)
let RAMSize = 65536;     //Divisor of maxMemoryTableHeight (max: 65536)

let tableMemoryWidth = 16;
let maxTableMemoryHeight = 20;

let screenStartIndex = 65536 - 256;
let screenSize = 16;

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
        
        //Update Screen
        generateScreen(elementScreen,RAM,screenStartIndex,screenSize,screenSize);   
    },
20); 


//10hz update interval of memory and regs.
setInterval(
    function (){
        if(!updateMemoryReg)return;
        updateMemoryReg = false;
        
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
        //Update editor.
        updeteEditorLinePos();
    },
100); 



function setAllToZerro(){
    fillArrayWithZerros(RAM);
    fillArrayWithZerros(SPM);
    fillArrayWithZerros(registers);
    fillArrayWithZerros(flags);
}

function fillArrayWithZerros(array){
    for (let i = 0; i < array.length; i++){
        array[i] = 0;
    }
}


function updatePointerToTableMemory(element, index, cl){

    const clElements = element.getElementsByClassName(cl);
    const indexElements = element.getElementsByClassName("id_"+index);

    if(clElements.length!=0){
        clElements[0].classList.remove(cl);
    }
    
    if(indexElements.length!=0){
        indexElements[0].classList.add(cl);
    }

}

function updeteEditorLinePos(){

    if(stepsPerLine == undefined)return;

    let sum = 0;

    for (let i = 0; i < stepsPerLine.length; i++){
        
        sum += stepsPerLine[i];

        if(sum>registers[6]){
            setPointerAtLine(i);
            return;
        }
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