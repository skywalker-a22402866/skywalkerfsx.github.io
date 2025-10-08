
const textchange = document.querySelector('#textchange');
const id2 = document.querySelector('#id2');
const red = document.querySelector('#red');
const green = document.querySelector('#green');
const blue = document.querySelector('#blue');

textchange.addEventListener("mouseover", passaby);
textchange.addEventListener("mouseout", passaoff);

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