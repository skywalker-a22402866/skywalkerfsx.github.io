


let counter = 0;
const heading = document.querySelector('h1');
const label = document.querySelector('#texto');
const butao = document.querySelector('#botao2');
const conta = document.querySelector('#conta');

function count() {
   counter++;
   heading.textContent = counter;
}

function saudar() {
   if (label.textContent != "###") {
      label.textContent = "###";
   }
   else {
      label.textContent = "Ola";
   }
}

function colorir() {
   if (butao.style.backgroundColor != "orange") {
      butao.style.backgroundColor = "orange";
   }
   else {
      butao.style.backgroundColor = "white";
   }
}

function dblclick() {
   counter++;
   conta.textContent = counter;
}