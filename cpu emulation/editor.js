

const codeTextarea = document.getElementById("code");


codeTextarea.addEventListener("input", function () {
  updateLineNumbers();
});



function updateLineNumbers() {
  text = "";
  for (let j = 0; j < codeTextarea.value.split("\n").length; j++)text = text + (j + 1) + "<br>" ;

  document.querySelector(".lines").innerHTML = text;
}


updateLineNumbers();