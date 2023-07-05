const codeTextarea = document.getElementById("code");
const overCodeTextarea = document.getElementById("overCode");

const commentRegex = /(\/\/.*)/g;

codeTextarea.addEventListener("input", function () {
  updateLineNumbers();
});


function updateLineNumbers() {
  let numbers = "";

  for (let i = 0; i < codeTextarea.value.split("\n").length; i++){
    numbers = numbers + (i + 1) + "<br>" ;
  }
  
  document.querySelector(".lines").innerHTML = numbers;

}


function getFilteredCodeText(){

  let textArray = codeTextarea.value.split("\n");

  for (let i = 0; i < textArray.length; i++){
    textArray[i] = textArray[i].replace(commentRegex, '').trimEnd().trimStart();
  }

  return textArray;
}


updateLineNumbers();