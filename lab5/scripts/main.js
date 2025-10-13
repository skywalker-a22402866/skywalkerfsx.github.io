
const textchange = document.querySelector('#textchange');
const id2 = document.querySelector('#id2');
const red = document.querySelector('#red');
const green = document.querySelector('#green');
const blue = document.querySelector('#blue');
const inbox1 = document.querySelector('#inbox1');
//const botaocor = document.querySelector('button.color');

textchange.addEventListener("mouseover", passaby);
textchange.addEventListener("mouseout", passaoff);
inbox1.addEventListener("keydown", kdown);
//botaocor.addEventListener("click",botaored);



document.querySelectorAll("button.color").forEach((b) => {
    b.onclick=function(){
        id2.style.color=b.dataset.color;
    }

})

//function botaored(){
//    id2.style.color = "red";
//}



function passaby() {
    textchange.textContent = "Obrigado por passares!";
}

function passaoff() {
    textchange.textContent = "Passa por aqui!";
}

function kdown(){
    inbox1.style.backgroundColor = "green";
}