
const textchange = document.querySelector('#textchange');
const id2 = document.querySelector('#id2');
const red = document.querySelector('#red');
const green = document.querySelector('#green');
const blue = document.querySelector('#blue');
const inbox1 = document.querySelector('#inbox1');

textchange.addEventListener("mouseover", passaby);
textchange.addEventListener("mouseout", passaoff);
textContent.addEventListener("keydown", kdown);

document.querySelectorAll("button.color").forEach((b) => {
    b.onclick=function(){
        id2.style.color=b.dataset.color;
    }

})





function passaby() {
    textchange.textContent = "Obrigado por passares!";
}

function passaoff() {
    textchange.textContent = "Passa por aqui!";
}

function kdown(){
    inbox1.style.color = "green";
}