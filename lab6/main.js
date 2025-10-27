//console.log(produtos)
const section = document.querySelector('#productos');

addEventListener("DOMContentLoaded", (event) => { 
    carregarProdutos(produtos);
})

function carregarProdutos(produtos){
    produtos.forEach(produto => {
        //console.log(produto);
        
       criarProduto(produto);

    });
}
function criarProduto(produto){

    const artigo = document.createElement('article')
    //artigo.textContent = produto.title;
    const imagem = document.createElement('img');
    imagem.src = produto.image;     // busca a imagem do produto
    imagem.alt = produto.title;     // texto alternativo
    imagem.style.width = "150px";   // opcional: define tamanho

    const titulo = document.createElement('h3');
    titulo.textContent = produto.title;

    const preco = document.createElement('p');
    preco.textContent = `Preço: €${produto.price.toFixed(2)}`;
    artigo.append(imagem, titulo, preco);
    section.append(artigo); 

}