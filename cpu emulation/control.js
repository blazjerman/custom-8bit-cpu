//Assembler
let assembyPointer = 0;
let stepsPerLine;

//Run
let stepFrequency = 1;
let indexStep = 0;
let running;

let instructionNames = Array(
    "HLT",

    "MOVA",
    "MOVB",
    "READA",
    "READB",
    
    "POPA",
    "POPB",
    "PUSHA",
    "PUSHB",
    "PUSHP",

    "JMP",
    "JIFC",
    "JIFZ",
    "JIFNC",
    "JIFNZ",
    "JIFCZ",
    "JIFNCZ",
    
    "SUM",
    "SUB",
    "NOT",
    "OR",
    "AND",
    "XOR",
    "SHL",
    "SHR",
    "CMP",

    "PUSHR"
)

//Instruction execution


//Frequency control
function run(){
        
    const timesPerInterval = Math.ceil(stepFrequency / 1000);
    const interval = stepFrequency <= 1000? 1 / stepFrequency * 1000 : 1;
    
    running = setInterval(
        function () {
            for (let i = 0; i < timesPerInterval; i++){
                if(!singleStep())break;
            }
        },
    interval);
}


function singleStep(){ 
    if(flags[2]==1)return false;
    switch(indexStep) {
        case 0:
            SETP();    //Copy P in RIN
            READR();   //Get ROUT from RIN
            READI();   //Copy ROUT in I
            INCP();    //Increase P
            break;
        case 1:
            SETP();  //Copy P in RIN
            exicuteCommand();   //Execute instruction from I (exicuteCommand will Increase P if its needed.)
    }

    updateScreen = true;
    updateMemoryReg = true;
    
    indexStep++;
    if(indexStep==2)indexStep=0;

    return true;
}


function exicuteCommand(){
    switch(registers[3]) {

        case 0:HLT();break;
        
        case 1:READR();READ(0);INCP();break;
        case 2:READR();READ(1);INCP();break;
        case 3:POPR();WRITE(0);WRITER();break;
        case 4:POPR();WRITE(1);WRITER();break;

        case 5:POP(0);break;
        case 6:POP(1);break;
        case 7:PUSH(0);break;
        case 8:PUSH(1);break;
        case 9:PUSHP();break;
        
        case 10:JMP();break;
        case 11:JIFC();break;
        case 12:JIFZ();break;
        case 13:JIFNC();break;
        case 14:JIFNZ();break;
        case 15:JIFCZ();break;
        case 16:JIFNCZ();break;

        case 17:SUM(0,1);break;
        case 18:SUB(0,1);break;
        case 19:NOT(0);break;
        case 20:OR(0,1);break;
        case 21:AND(0,1);break;
        case 22:XOR(0,1);break;
        case 23:SHL(0);break;
        case 24:SHR(0);break;
        case 25:CMP(0,1);break;

        case 26:READR();PUSH(7);INCP();break;
    }
}


//assemble for cpu
function assembleCode(){

    assembyPointer = 0;
    indexStep = 0;

    if(running != undefined){
        startStop();
    }

    const code = getFilteredCodeText();
    stepsPerLine = new Int8Array(code.length);

    //Get execution steps for every line of code.
    for (let i = 0; i < code.length; i++) {
        for (let j = 0; j < code[i].length; j++) {
            
            const instruction = code[i][j];

            if(instructionNames.indexOf(instruction) != -1){
                stepsPerLine[i]++;
            }else if(!isNaN(parseInt(instruction))){
                stepsPerLine[i]++;
            }else if(instruction.at(-1) == ">"){
                stepsPerLine[i]+=4;
            }
        }
    }

    
    //Setup jumps.
    for (let i = 0; i < code.length; i++) {
        for (let j = 0; j < code[i].length; j++){

            const instruction = code[i][j];

            if(instruction.at(-1) == ">"){

                let locationIndex = 0;

                for (let k = 0; k < code.length; k++){

                    if(instruction.slice(0, -1)+":"==code[k][0]){
                        code[k][0] = "";
                        code[i].splice(j, 1, "PUSHR",((locationIndex >> 8 ) & 0xff) + "","PUSHR",(locationIndex & 0xff) + "");
                        break;  
                    }

                    locationIndex += stepsPerLine[k];

                }
            }
        }
    }

    setAllToZerro();

    //Move to memory.
    addInstructions(code);
}

function addInstructions(code){
    
    for (let i = 0; i < code.length; i++) {
        for (let j = 0; j < code[i].length; j++){

            const name = code[i][j];

            if(name == "") continue;

            const instruction = parseInt(name);
        
            if(!isNaN(instruction)){
                RAM[assembyPointer] = instruction;
            }else{
                const indexOfName = instructionNames.indexOf(name);
                
                if(indexOfName==-1){
                    compileError(i);
                    return;
                }
        
                RAM[assembyPointer] = indexOfName;
            }
        
            assembyPointer++;

        }
    }

    updateMemoryReg = true;
    updateScreen = true;
    
}

function compileError(line){
    console.log("Compile error!!! At line: " + (line + 1));
    setLineError(line)
}