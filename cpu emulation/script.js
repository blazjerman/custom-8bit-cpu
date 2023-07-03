let stackPointerMemorySize = 256;
let randomAccesMemorySize = 256*256;

let maxMemoryTableHeight = 20;

let hex = 16;

let tableMemoryWidth = 16;

let stackPointerMemory = new Uint8Array(stackPointerMemorySize);
let randomAccesMemory = new Uint8Array(randomAccesMemorySize);

let registersSize  = new Array(   1,      1,      1,      1,      2,      1,      2,      1,    2        ); //In bytes
let registersNames = new Array(  "A",    "B",    "R",    "I",    "P",    "SP",   "RIN",  "ROUT","SPOUT"  );
let registers      = new Array(   0,      0,      0,      0,      0,      0,      0,      0,     0       );
let registersIdex  = new Array(   0,      1,      2,      3,      5,      4,      6,      8,     7       );

let screenStartIndex = 0;
let screenSize = 16;

let stepFrequency = 1;

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
    updateMemoryAndReg()
},
100); 

function updateScreeRegs(){
    //Update Screen
    document.getElementById("screen").innerHTML = generateScreen(randomAccesMemory,screenStartIndex,screenSize,screenSize);   
}


function updateMemoryAndReg(){
    //Update memory.
    updateMemory("stackPointerMemory",stackPointerMemory); 
    updateMemory("randomAccesMemory",randomAccesMemory);
    //Update Regs. and memory pointers.
    updatePointerToTableMemory("randomAccesMemory", registers[4],"P");
    updatePointerToTableMemory("stackPointerMemory", registers[5],"SP");
    updatePointerToTableMemory("randomAccesMemory", registers[6],"RIN");
    generateRegisterTable();
}






function generateTables(){

    
    randomAccesMemory[0] = 1;
    randomAccesMemory[1] = 6;
    randomAccesMemory[2] = 2;
    randomAccesMemory[3] = 4;
    randomAccesMemory[4] = 5;
    randomAccesMemory[5] = 6;
    randomAccesMemory[6] = 4;
    
    
    updateScreeRegs();
    updateMemoryAndReg(); 
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



function updateMemory(id,memory){
    let element = document.getElementById(id);
    element.innerHTML = generateMemoryTable(memory);
}


//Table generation
function generateMemoryTable(memory){

    let height = memory.length/tableMemoryWidth;
    if(height > maxMemoryTableHeight)height = maxMemoryTableHeight;

    let gridData = '<tr><td></td>';

    for (let j = 0; j < tableMemoryWidth; j++) {
        gridData += '<td>' + byteAsHex(j,getBaseLog(hex, tableMemoryWidth)) + '</td>';
    }
    
    gridData += '</tr>';

    for (let i = 0; i < height; i++) {
      
        gridData += '<tr><td>' + byteAsHex(i,getBaseLog(hex, height)) + '</td>';
        
        for (let j = 0; j < tableMemoryWidth; j++) {
            
            if((i * tableMemoryWidth + j) >= memory.length)break;
            gridData += '<td class="id_' + (i * tableMemoryWidth + j) + '">' + byteAsHex(memory[(i * tableMemoryWidth + j)],2) + '</td>';

        }

        gridData += '</tr>';

    }

    return gridData;
}

function generateRegisterTable(){


    let names = '<tr>';
    let values = '<tr>';

    for (let i = 0; i < registers.length; i++) {
        let index = registersIdex[i];
        names += '<td>' + registersNames[index] + '</td>';
        values += '<td class="' + registersNames[index] + '">' + byteAsHex(registers[index],registersSize[index]*2) + '</td>';
    }

    document.getElementById("registers").innerHTML = names + '</tr>' + values + '</tr>';
}

function byteAsHex(byte,size){
    return byte.toString(hex).padStart(size, '0').toUpperCase();
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}


//Screen

function generateScreen(memory,start,x,y){

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

    return gridData;
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
    for (let i = 0; i < randomAccesMemory.length; i++) {
        if(randomAccesMemory[i] == 0){
            setRandomAccesMemory(i,value);
            break;
        }
    }
}




//Instruction execution


//Frequency control
function run(freq){
    
    stepFrequency = freq*2;
    
    let indexStep = 0; //4 are needed for one instruction

    let interval = 1;
    let timesPerInterval = Math.ceil(stepFrequency/1000);
    
    if(stepFrequency <= 1000)interval = 1 / stepFrequency * 1000;
    
    setInterval(
        function () {
            for (let i = 0; i < timesPerInterval; i++) {
                step(indexStep++);
                if(indexStep==4)indexStep=0;
            }
        },
    interval);


    generateTables();
}




function step(step){ 
    updateScreen = true;
    updateMemoryReg = true;
    switch(step) {
        case 0:
            registers[6] = registers[4]; //Kopiraj P v RIN
            registers[7] = randomAccesMemory[registers[6]]; //Pridobi ROUT glede na RIN
            break;
        case 1:
            registers[3] = registers[7];//Kopiraj ROUT v I
            sumReg(4,1,0xffff);//Povečaj P
            break;
        case 2:
            registers[6] = registers[4]; //Kopiraj P v RIN
            break;
        case 3:
            exicuteCommand();//Izvedi komando iz I-ja
    }
}


function sumReg(index,value,bits){
    value = registers[index] + value;
    registers[index] = value & bits;
    if(value != registers[index]){
        console.log("Carry enable!!");
    }
}

function exicuteCommand(){

    switch(registers[3]) {
        case 1:
            registers[0] = randomAccesMemory[registers[6]];//Premakni iz rama v A
            sumReg(4,1,0xffff);//Povečaj P
            break;
        case 2:
            registers[1] = randomAccesMemory[registers[6]];;//Premakni iz rama v B
            sumReg(4,1,0xffff);//Povečaj P
            break;
        case 3:
            randomAccesMemory[registers[1]] = registers[0];//Kopira A v RAM glede na poiter B-ja
            break;
        case 4:
            registers[4] = registers[1];//Kopira B v SP
            break;
        case 5:
            sumReg(0,1,0xff);;//Povečaj A
            break;
        case 6:
            randomAccesMemory[registers[0]] = registers[0];//Kopira A v RAM glede na poiter A-ja (kr neki)
            break;


      }
}

