
const textchange = document.querySelector('#textchange');
const id2 = document.querySelector('#id2');
const red = document.querySelector('#red');
const green = document.querySelector('#green');
const blue = document.querySelector('#blue');
const inbox1 = document.querySelector('#inbox1');
const colorir = document.querySelector('#cor');
const submeter = document.querySelector("#submeter");
const conta = document.querySelector("#conta");
const valor = document.querySelector("#valor");

let count = 0;

textchange.addEventListener("mouseover", passaby);
textchange.addEventListener("mouseout", passaoff);
inbox1.addEventListener("keydown", kdown);
inbox1.addEventListener("keyup", kup);
inbox1.addEventListener("change", inputChange);
submeter.addEventListener("click", colorirCaixa);
conta.addEventListener("click", contagem);


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
    inbox1.style.backgroundColor = "green";
}

function kup(){
    inbox1.style.backgroundColor = "yellow";
}

function inputChange(){
    inbox1.style.backgroundColor = "blue";
}

function colorirCaixa(){
    colorir.style.backgroundColor = colorir.value;
}

function contagem(){
    count++;
    valor.textContent = count;
}