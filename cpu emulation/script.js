let stackPointerMemorySize = 256;
let randomAccesMemorySize = 65536/16;

let hex = 16;

let tableMemoryWidth = 16;

let stackPointerMemory = new Uint8Array(stackPointerMemorySize);
let randomAccesMemory = new Uint8Array(randomAccesMemorySize);

let registersSize  = new Array(   1,      1,      1,      1,      2,      2,      2,      1,     ); //In bytes
let registersNames = new Array(  "A",    "B",    "R",    "I",    "P",    "SP",   "RIN",  "ROUT"  );
let registers      = new Array(   0,      0,      0,      0,      0,      0,      0,      0      );

let screenStartIndex = 0;
let screenSize = 16;

function generateTables(){

    setStackPointerMemory(-1,0);
    setRandomAccesMemory(-1,0);
    updateRegisters(-1,0);
    

    updateScreen(-1);
}

function updateScreen(index){
    if(index == -1 || ( index >= screenStartIndex && index < (screenStartIndex + screenSize * screenSize) ) ){
        document.getElementById("screen").innerHTML = generateScreen(randomAccesMemory,screenStartIndex,screenSize,screenSize);
    }
}



function setStackPointerMemory(index,value){
    updateMemory("stackPointerMemory",stackPointerMemory,index, value); 
}

function setRandomAccesMemory(index,value){
    updateMemory("randomAccesMemory",randomAccesMemory,index,value);
    updateScreen(index);
}

function updateRegisters(index,value){

    if(index!=-1)registers[index] = value;

    updatePointerToTableMemory("randomAccesMemory", registers[4],"P");
    updatePointerToTableMemory("stackPointerMemory", registers[5],"SP");
    updatePointerToTableMemory("randomAccesMemory", registers[6],"RIN");

    generateRegisterTable();
}


function updatePointerToTableMemory(id, index, cl){
    let element = document.getElementById(id);

    if(element.getElementsByClassName(cl).length!=0){
        element.getElementsByClassName(cl)[0].classList.remove(cl);
    }
    element.getElementsByClassName("id_"+index)[0].classList.add(cl);
}



function updateMemory(id,memory,index,value){

    let element = document.getElementById(id);
    
    if(index != -1){
        memory[index] = value;
        element.getElementsByClassName("id_"+index)[0].innerHTML = byteAsHex(memory[index],2);
    }else{
        element.innerHTML = generateMemoryTable(memory);
    }

}


//Table generation
function generateMemoryTable(memory){

    let height = memory.length/tableMemoryWidth;
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
        names += '<td>' + registersNames[i] + '</td>';
        values += '<td class="' + registersNames[i] + '">' + byteAsHex(registers[i],registersSize[i]*2) + '</td>';
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







//Exicution
let flip = true;

async function step(){
    if(flip){
        updateRegisters(6,registers[4]);
        await delay(1000);
        setInstructionReg();
    }else{
        updateRegisters(6,registers[4]);
        await delay(1000);
        exicuteCommand();
    }

    updateRegisters(4,++registers[4]);

    
    flip = !flip;
}


function setInstructionReg(){
    updateRegisters(7,randomAccesMemory[registers[6]]);
    updateRegisters(3,randomAccesMemory[registers[6]]);
}



function exicuteCommand(){

    switch(registers[7]) {
        case 1:
            updateRegisters(0,randomAccesMemory[registers[6]])
        case 2:
            
        case 3:
            
        default:

      }



}



function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n);
    });
}
