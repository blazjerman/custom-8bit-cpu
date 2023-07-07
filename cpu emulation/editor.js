const codeTextareaElement = document.getElementById("code");
const overCodeTextareaElement = document.getElementById("overCode");
const linesElement = document.getElementById("lines");

const commentRegex = /(\/\/.*)/g;
const newLineRegex = /\n/;
const multipleSpacesRegex = /\s+/;

codeTextareaElement.addEventListener("input", function () {
  updateLineNumbers();
});


function updateLineNumbers() {
  let numbers = "";

  for (let i = 0; i < codeTextareaElement.value.split(newLineRegex).length; i++){
    numbers = numbers + '<span class = "id_' + i + '">' + (i + 1) + '</span><br>';
  }
  
  linesElement.innerHTML = numbers;

}


function getFilteredCodeText(){

  let textArray = codeTextareaElement.value.split(newLineRegex);

  for (let i = 0; i < textArray.length; i++){
    textArray[i] = textArray[i].replace(commentRegex, '').trimEnd().trimStart().split(multipleSpacesRegex);
  }
  return textArray;
}


function setLineError(line){
  document.getElementsByClassName("id_"+line)[0].classList.add("lineError");
}

function setPointerAtLine(line){

  const cl = "pointerAtLine";
  const pointerAtLineElement = document.getElementsByClassName(cl);

  if(pointerAtLineElement.length!=0){
    pointerAtLineElement[0].classList.remove(cl);
  }

  if(line==-1)return;

  document.getElementsByClassName("id_"+line)[0].classList.add(cl);

}