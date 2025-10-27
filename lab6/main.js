//console.log(produtos)
const section = document.querySelector('#produtos');
const basket = document.querySelector('#carrinho');
const totalCarrinho = document.getElementById('total');

addEventListener("DOMContentLoaded", (event) => { 
    carregarProdutos(produtos);
    atualizarCarrinho(produtos);
})

function carregarProdutos(produtos){
    produtos.forEach(produto => {
        //console.log(produto);
        
        criarProduto(produto);
        
    });
}

function atualizarCarrinho(produtos){
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const ul = document.getElementById('carrinho');
    //console.log('Produtos no carrinho:', carrinho);
    //localStorage.setItem('carrinho', JSON.stringify(carrinho));
    ul.innerHTML = '';
    let total = 0;    
    
    carrinho.forEach((produto,index) => {
        
        total += produto.price; // soma o preço de cada produto
        const li = document.createElement('li')
        const imagem = document.createElement('img');
        imagem.src = produto.image;     // busca a imagem do produto
        imagem.alt = produto.title;     // texto alternativo
        imagem.style.width = "150px";   // opcional: define tamanho
        
        const titulo = document.createElement('h3');
        titulo.textContent = produto.title;
        
        const preco = document.createElement('p');
        preco.textContent = `Preço: €${produto.price.toFixed(2)}`;
        // Botão de remover do carrinho
        const botaoRemover = document.createElement('button');
        
        botaoRemover.textContent = '- Retirar do carrinho';
        botaoRemover.addEventListener('click', () => removerCarrinho(index));
        
        li.append(imagem, titulo, preco, botaoRemover);
        ul.append(li); 
        
    })

    totalCarrinho.textContent = `Total: €${total.toFixed(2)}`;
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
    // Botão de adicionar ao carrinho
    const botaoAdicionar = document.createElement('button');
    botaoAdicionar.textContent = '+ Adicionar ao carrinho';
    botaoAdicionar.addEventListener('click', () => adicionarAoCarrinho(produto));
    
    artigo.append(imagem, titulo, preco, botaoAdicionar);
    section.append(artigo); 
    
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
    // 1. Pega o carrinho existente
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // 2. Adiciona o novo produto
    carrinho.push(produto);
    
    // 3. Salva de volta no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

function removerCarrinho(index){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1); // Remove o item pelo índice
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
    
}