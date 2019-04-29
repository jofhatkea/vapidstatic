// This is a main JavaScript file that will ll be compiled into /javascripts/site.js
//
// Any JavaScript file in your site folder can be referenced here by using import or require statements.
// Additionally, you can import modules installed via your package.json file.
//
// For example:
// import './fileName'
//
// To learn more, visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

import { today } from "is_js";

const h2 = document.querySelector(".container header h2");
const form = document.querySelector("form");
form.style.display = "none";
var now = new Date();
if (today(now)) {
  h2.textContent = "it is today";
}
h2.addEventListener("click", () => {
  form.style.display = "block";
});
