

const codeTextarea = document.getElementById("code");


codeTextarea.addEventListener("input", function () {
  updateLineNumbers();
});



function updateLineNumbers() {
  text = "";
  for (let i = 0; i < codeTextarea.value.split("\n").length; i++)text = text + (i + 1) + "<br>" ;

  document.querySelector(".lines").innerHTML = text;
}


updateLineNumbers();