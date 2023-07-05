const frequences      = Array(    1,    4,  1000,  64000,1000000,10000000,100000000);
const frequencesNames = Array("1hz","4hz","1khz","64khz", "1Mhz", "10Mhz","100Mhz" );

const elementSelect = document.getElementById("frequency");  
const elementAssemble = document.getElementById("assemble");  
const elementStep = document.getElementById("step");  
const elementStart = document.getElementById("start");  

function generateSpeedSelection(element){
    text = "";
    for (let i = 0; i < frequences.length; i++){
        text += '<option value="' + frequences[i] + '">' + frequencesNames[i] + '</option>';
    } 
    element.innerHTML = text
}

function setFrequency(){
    stepFrequency = elementSelect.value * 2;
    if(running!=undefined){
        start();
        start();
    }
}

function assemble(){

}
function step(){
    singleStep();
}

function start(){
    
    if(running==undefined){
        elementStart.innerText="Stop";
        run();
    }else{
        elementStart.innerText="Start";
        clearInterval(running);
        running = undefined;
    }
    
}



generateSpeedSelection(elementSelect);