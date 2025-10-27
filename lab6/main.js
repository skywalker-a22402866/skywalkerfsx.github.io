//console.log(produtos)
const section = document.querySelector('#products');

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
    artigo.textContent = produto.title;
    section.append(artigo); 

}