const codeTextarea = document.getElementById("code");
const overCodeTextarea = document.getElementById("overCode");

const spaceRegex = /^[\s\S]*\S[\s\S]*$/;
const commentRegex = /(\/\/.*)/g;
const nextLineRegex = /\n/g;

codeTextarea.addEventListener("input", function () {
  updateLineNumbers();
});


function updateLineNumbers() {
  let numbers = "";

  for (let i = 0; i < codeTextarea.value.split("\n").length; i++)numbers = numbers + (i + 1) + "<br>" ;
  document.querySelector(".lines").innerHTML = numbers;

  let text = codeTextarea.value;
  
  text = text.replace(commentRegex, '<span style="color: green" class="special-characters">$1</span>');
  text = text.replace(nextLineRegex, "<br>");

  //overCodeTextarea.innerHTML = text;

}


function getFilteredCodeText(){

  let text = codeTextarea.value;

  text = text.replace(commentRegex, '');
  
  return text.split("\n").filter(word => spaceRegex.test(word));
}


updateLineNumbers();