

let SPMSize = 256;       //Divisor of maxMemoryTableHeight (max: 256)
let RAMSize = 65536;    //Divisor of maxMemoryTableHeight (max: 65536)

let tableMemoryWidth = 16;
let maxTableMemoryHeight = 20;

let screenStartIndex = 0;
let screenSize = 16;

let stepFrequency = 1;

let hex = 16;

//Memory
let SPM = new Uint8Array(SPMSize);
let RAM = new Uint8Array(RAMSize);

//Registers
let registersSize  = new Array(   1,      1,      1,      1,      2,      1,      2,      1,    2        ); //In bytes
let registersNames = new Array(  "A",    "B",    "R",    "I",    "P",    "SP",   "RIN",  "ROUT","SPOUT"  );
let registersIdex  = new Array(   0,      1,      2,      3,      5,      4,      6,      8,     7       );
let registers      = new Uint16Array(registersNames.length);

//Flags
let flagsNames = new Array(  "C",    "Z",    "H"  );
let flags      = new Uint8Array(flagsNames.length);


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
    generateScreen("screen",RAM,screenStartIndex,screenSize,screenSize);   
}

function updateMemoryRegFlag(){
    //Update memory.
    generateMemoryTable("stackPointerMemory",SPM); 
    generateMemoryTable("randomAccesMemory",RAM);
    //Update Regs. and memory pointers.
    generateRegisterTable("registers");
    updatePointerToTableMemory("randomAccesMemory", registers[4],"P");
    updatePointerToTableMemory("stackPointerMemory", registers[5],"SP");
    updatePointerToTableMemory("randomAccesMemory", registers[6],"RIN");
    //Update flags.
    generateFlagTable("flags");
}





//First run.
function generateTables(){

    
    RAM[0] = 1;
    RAM[1] = 6;
    RAM[2] = 2;
    RAM[3] = 4;
    RAM[4] = 5;
    RAM[5] = 6;
    RAM[6] = 4;
    
    updateScreeRegs();
    updateMemoryRegFlag(); 
}



function updatePointerToTableMemory(id, index, cl){
    let element = document.getElementById(id);

    if(element.getElementsByClassName(cl).length!=0){
        element.getElementsByClassName(cl)[0].classList.remove(cl);
    }
    
    if(element.getElementsByClassName("id_"+index).length!=0){
        element.getElementsByClassName("id_"+index)[0].classList.add(cl);
    }
}


//Table generation
function generateMemoryTable(id,memory){

    let height = memory.length/tableMemoryWidth;
    if(height > maxTableMemoryHeight)height = maxTableMemoryHeight;

    let gridData = '<tr><td></td>';

    for (let j = 0; j < tableMemoryWidth; j++) {
        gridData += '<td>' + byteAsHex(j,getBaseLog(hex, tableMemoryWidth)) + '</td>';
    }
    
    gridData += '</tr>';

    for (let i = 0; i < height; i++) {
      
        gridData += '<tr><td>' + byteAsHex(i,getBaseLog(hex, height)) + '</td>';
        
        for (let j = 0; j < tableMemoryWidth; j++) {
            gridData += '<td class="id_' + (i * tableMemoryWidth + j) + '">' + byteAsHex(memory[(i * tableMemoryWidth + j)],2) + '</td>';
        }

        gridData += '</tr>';

    }

    document.getElementById(id).innerHTML = gridData;
}

function generateRegisterTable(id){

    let names = '<tr>';
    let values = '<tr>';

    for (let i = 0; i < registers.length; i++) {
        
        let index = registersIdex[i];
        names += '<td>' + registersNames[index] + '</td>';
        values += '<td class="' + registersNames[index] + '">' + byteAsHex(registers[index],registersSize[index]*2) + '</td>';
    }

    document.getElementById(id).innerHTML = names + '</tr>' + values + '</tr>';
}

function generateFlagTable(id){
    let text = "<p>";
    for (let i = 0; i < flagsNames.length; i++) text += flagsNames[i] + " ";
    text += "<br>";
    for (let i = 0; i < flags.length; i++) text += flags[i] + " ";
    document.getElementById(id).innerHTML = text + "</p>";
}


function byteAsHex(byte,size){
    return byte.toString(hex).padStart(size, '0').toUpperCase();
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}


//Screen

function generateScreen(id,memory,start,x,y){

    let gridData = '';

    let index = start;

    for (let i = 0; i < x; i++) {
      
        gridData += '<tr>';
        
        for (let j = 0; j < y; j++) {

            gridData += '<td class="id_' + index + '" style="background-color: ' + get32ColorFrom8(memory[index]) + '"></td>';
            index++;

        }

        gridData += '</tr>';

    }

    document.getElementById(id).innerHTML = gridData;
}

function get32ColorFrom8(color){
    let r = Math.round(((color>>5)/7)*255);
    let g = Math.round((((color>>2)&7)/7)*255);
    let b = Math.round(((color&3)/3)*255);
    return "rgb("+ r + ", " + g + ", " + b + ")"
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

function run(freq){
    
    stepFrequency = freq*2; //1 cycle needs 2 steps.
    
    let interval = 1;
    let timesPerInterval = Math.ceil(stepFrequency/1000);
    
    if(stepFrequency <= 1000)interval = 1 / stepFrequency * 1000;
    
    running = setInterval(
        function () {
            for (let i = 0; i < timesPerInterval; i++) {
                step(indexStep++);
                if(indexStep==4)indexStep=0;
            }
        },
    interval);

}






function step(step){ 
    switch(step) {
        case 0:
            registers[6] = registers[4];                        //Copy P in RIN
            registers[7] = RAM[registers[6]];                   //Get ROUT from RIN
            break;
        case 1:
            registers[3] = registers[7];                        //Copy ROUT in I
            registers[4]++;                                     //Increase P
            break;
        case 2:
            registers[6] = registers[4];                        //Copy P in RIN
            break;
        case 3:
            exicuteCommand();                                   //Execute instruction from I (exicuteCommand will Increase P if its needed.)
    }
    updateScreen = true;
    updateMemoryReg = true;
}



function operations(index,value,bits,cz,operation){
    switch(operation) {
    case "SUM":
        value = registers[index] + value;
        break;
    case "NEG":
        value = registers[index] - value;
        break;
    case "SHL":
        value = registers[index] << 1;
        break;
    case "SHR":
        value = registers[index] >> 1;
        break;
    case "AND":
        value = registers[index] & value;
        break;
    case "OR":
        value = registers[index] | value;
        break;
    case "NOT":
        value = ~registers[index];
        break;
    case "XOR":
        value = registers[index] ^ value;
        break;
    }
    registers[index] = value & bits;
    if(cz)checkFlags(value,index);
}


function checkFlags(value,index){
    if(value != registers[index])flags[0]=1;
    else flags[0]=0;
    if(0 == registers[index])flags[1]=1;
    else flags[1]=0;
}


function exicuteCommand(){

    switch(registers[3]) {
        case 1:
            registers[0] = RAM[registers[6]];//Premakni iz rama v A
            registers[4]++;//Povečaj P
            break;
        case 2:
            registers[1] = RAM[registers[6]];;//Premakni iz rama v B
            registers[4]++;//Povečaj P
            break;
        case 3:
            RAM[registers[1]] = registers[0];//Kopira A v RAM glede na poiter B-ja
            break;
        case 4:
            registers[4] = registers[1];//Kopira B v SP
            break;
        case 5:
            operations(0,1,0xff,true,"SUM");//Povečaj A
            break;
        case 6:
            RAM[registers[0]] = registers[0];//Kopira A v RAM glede na poiter A-ja (kr neki)
            break;
      }
}

