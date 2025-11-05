# skywalkerfsx.github.io
Repositorio de Web testes

Rascunhos:

1 EX:
#########################################################################################################################################
INDEX.HTML
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        body {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;

            background: lightblue;
        }


        ul {
            list-style-type: none;
            /* remove os bullets */
            padding: 0;
            /* remove o recuo padrão da lista */
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 5px;
        }

        li {
            background: white;
            border-radius: 10px;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            gap: 5px;
        }
    </style>
</head>

<body>
    <h1>Categorias</h1>
    <select name="categoria" id="categoria">
        <option value="">categoria</option>
    </select>

    <h1>Produtos</h1>
    <button>ordenar</button>
    <ul></ul>

    <script>
        // cria uma lista de nomes de produtos (campo title)
        // -> https://deisishop.pythonanywhere.com/products/


        // A. Variaveis
        let produtos = []
        const ul = document.querySelector('ul')
        const botao = document.querySelector('button')
        let categorias = []
        const select = document.querySelector('select')


        // B. Fetch de dados
        fetch('https://deisishop.pythonanywhere.com/products/')
            .then(response => response.json())
            .then(data => {
                produtos = data
                mostraProdutos(produtos)
            })

        fetch('https://deisishop.pythonanywhere.com/categories')
            .then(response => response.json())
            .then(data => {
                categorias = data
                mostraCategorias(categorias)
            })

        // C. Funções Auxiliares
        function mostraProdutos(lista) {
            ul.innerHTML = ''
            lista.forEach(produto => {
                const li = document.createElement('li')
                li.innerHTML = produto.title
                ul.append(li)
            })

        }

        function mostraCategorias(lista) {
            //select.innerHTML = ''

            lista.sort()
            lista.forEach(categoria => {
                const opcao = document.createElement('option')
                opcao.value = categoria
                opcao.textContent = categoria
                select.appendChild(opcao);
            })
        }
        //Event handler
        function ordenar() {
            produtos.sort((p1, p2) => p1.price - p2.price)
            mostraProdutos(produtos)
        }

        function filtrar() {
            const categoriaEscolhida = select.value

            if (categoriaEscolhida == 'categoria') {
                mostraProdutos(produtos)
            }
            else {
                const produtosFiltrados = produtos.filter(produto => categoriaEscolhida === produto.category)
                mostraProdutos(produtosFiltrados)
            }
        }


        //Event Listener
        botao.onclick = ordenar
        select.onchange = filtrar

    </script>
</body>

</html>
#########################################################################################################################
2 EX:

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Loja</title>
</head>

<body>
    <header>
        <h1>Bem-vindo à Nossa Loja</h1>
        <nav>
            <ul>
                <li><a href="#produtos">Produtos</a></li>
                <li><a href="#cesto">Cesto</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="produtos">
            <h2>Produtos Disponíveis</h2>
            <section id="lista-produtos" class="lista-produtos" aria-label="Lista de produtos"></section>
        </section>

        <section id="cesto">
            <h2>Cesto</h2>
            <p>O cesto está vazio.</p>
            
        </section>
    </main>
    <script src="main.js"></script>
</body>

</html>
------------------------------------------------------------------------------------------------------------------------------
JavaScript:


const API_URL = 'https://deisishop.pythonanywhere.com/products/';
const CATEGORIES_URL = 'https://deisishop.pythonanywhere.com/categories/';
const BUY_URL = 'https://deisishop.pythonanywhere.com/buy/';
const STORAGE_KEY = 'produtos-selecionados';
let produtosCache = [];
let categoriaAtiva = '';
let ordenacaoAtiva = '';
let termoPesquisa = '';
const checkoutEstado = {
    estudante: false,
    cupao: '',
    nome: '',
    mensagem: ''
};


function initCart() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

function getCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (_) {
        return [];
    }
}

function setCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addToCart(produto) {
    const cart = getCart();
    cart.push({ id: produto.id, title: produto.title, price: produto.price, image: produto.image });
    setCart(cart);
    renderCestoCount();
    atualizaCesto();
}

function renderCestoCount() {
    const cestoSec = document.querySelector('#cesto');
    if (!cestoSec) { return; }

    // usa o primeiro <p> dentro da secção cesto
    let info = cestoSec.querySelector('p');
    if (!info) {
        info = document.createElement('p');
        cestoSec.appendChild(info);
    }

    const cart = getCart();
    if (cart.length === 0) {
        info.textContent = 'O cesto está vazio.';
    } else {
        const total = cart.reduce((acc, it) => acc + (Number(it.price) || 0), 0);
        const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
        info.textContent = `Itens no cesto: ${cart.length} • Total: ${formatoEUR.format(total)}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    renderCestoCount();
    atualizaCesto();
    setupFiltros();
    carregarProdutosDaApi();
});

function setupFiltros() {
    const secProdutos = document.querySelector('#produtos');
    const listaProdutos = document.querySelector('#lista-produtos');
    if (!secProdutos || !listaProdutos) {
        return;
    }

    let barraFiltros = secProdutos.querySelector('.filtros');
    if (!barraFiltros) {
        barraFiltros = document.createElement('div');
        barraFiltros.className = 'filtros';
        secProdutos.insertBefore(barraFiltros, listaProdutos);
    } else {
        barraFiltros.innerHTML = '';
    }

    const labelCategoria = document.createElement('label');
    labelCategoria.setAttribute('for', 'filtro-categoria');
    labelCategoria.textContent = 'Filtrar: ';

    const selectCategoria = document.createElement('select');
    selectCategoria.id = 'filtro-categoria';

    const opcaoTodas = document.createElement('option');
    opcaoTodas.value = '';
    opcaoTodas.textContent = 'Todas as categorias';
    selectCategoria.appendChild(opcaoTodas);

    selectCategoria.addEventListener('change', () => {
        categoriaAtiva = selectCategoria.value;
        renderProdutosFiltrados();
    });

    const labelOrdenacao = document.createElement('label');
    labelOrdenacao.setAttribute('for', 'ordenacao-preco');
    labelOrdenacao.textContent = ' Ordenar: ';

    const selectOrdenacao = document.createElement('select');
    selectOrdenacao.id = 'ordenacao-preco';

    const opcaoDefault = document.createElement('option');
    opcaoDefault.value = '';
    opcaoDefault.textContent = 'Ordenar pelo preço';
    selectOrdenacao.appendChild(opcaoDefault);

    const opcaoDesc = document.createElement('option');
    opcaoDesc.value = 'desc';
    opcaoDesc.textContent = 'Preço Decrescente';
    selectOrdenacao.appendChild(opcaoDesc);

    const opcaoAsc = document.createElement('option');
    opcaoAsc.value = 'asc';
    opcaoAsc.textContent = 'Preço Crescente';
    selectOrdenacao.appendChild(opcaoAsc);

    selectOrdenacao.addEventListener('change', () => {
        ordenacaoAtiva = selectOrdenacao.value;
        renderProdutosFiltrados();
    });

    const labelPesquisa = document.createElement('label');
    labelPesquisa.setAttribute('for', 'pesquisa-produto');
    labelPesquisa.textContent = ' Procurar: ';

    const inputPesquisa = document.createElement('input');
    inputPesquisa.type = 'search';
    inputPesquisa.id = 'pesquisa-produto';
    inputPesquisa.placeholder = 'pesquise por produto';

    inputPesquisa.addEventListener('input', () => {
        termoPesquisa = inputPesquisa.value.trim().toLowerCase();
        renderProdutosFiltrados();
    });

    barraFiltros.appendChild(labelCategoria);
    barraFiltros.appendChild(selectCategoria);
    barraFiltros.appendChild(labelOrdenacao);
    barraFiltros.appendChild(selectOrdenacao);
    barraFiltros.appendChild(labelPesquisa);
    barraFiltros.appendChild(inputPesquisa);

    carregarCategorias(selectCategoria);
}

async function carregarCategorias(select) {
    try {
        const resposta = await fetch(CATEGORIES_URL);
        if (!resposta.ok) {
            throw new Error(`Falha ao obter categorias: ${resposta.status}`);
        }

        const categorias = await resposta.json();
        categorias.forEach((categoria) => {
            const opcao = document.createElement('option');
            opcao.value = categoria;
            opcao.textContent = categoria;
            select.appendChild(opcao);
        });
    } catch (erro) {
        console.error(erro);
    }
}

async function carregarProdutosDaApi() {
    const container = document.querySelector('#lista-produtos');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    const indicador = document.createElement('p');
    indicador.className = 'loading';
    indicador.textContent = 'A carregar produtos...';
    container.appendChild(indicador);

    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Falha ao obter produtos: ${resposta.status}`);
        }

        const lista = await resposta.json();
        produtosCache = Array.isArray(lista) ? lista : [];
        container.innerHTML = '';
        renderProdutosFiltrados();
    } catch (erro) {
        container.innerHTML = '';
        const mensagemErro = document.createElement('p');
        mensagemErro.className = 'erro';
        mensagemErro.textContent = 'Não foi possível carregar os produtos. Tente novamente mais tarde.';
        container.appendChild(mensagemErro);
        console.error(erro);
    }
}

function renderProdutosFiltrados() {
    const container = document.querySelector('#lista-produtos');
    if (!container) {
        return;
    }

    let lista = Array.isArray(produtosCache) ? [...produtosCache] : [];
    if (categoriaAtiva) {
        lista = lista.filter((produto) => produto.category === categoriaAtiva);
    }

    if (termoPesquisa) {
        lista = lista.filter((produto) => {
            const titulo = String(produto.title || '').toLowerCase();
            return titulo.includes(termoPesquisa);
        });
    }

    if (!Array.isArray(lista) || lista.length === 0) {
        container.innerHTML = '';
        container.setAttribute('role', 'list');
        const aviso = document.createElement('p');
        aviso.className = 'sem-resultados';
        aviso.textContent = 'Nenhum produto encontrado para este filtro.';
        container.appendChild(aviso);
        return;
    }

    if (ordenacaoAtiva === 'asc') {
        lista.sort((a, b) => {
            const precoA = Number(a.price) || 0;
            const precoB = Number(b.price) || 0;
            return precoA - precoB;
        });
    } else if (ordenacaoAtiva === 'desc') {
        lista.sort((a, b) => {
            const precoA = Number(a.price) || 0;
            const precoB = Number(b.price) || 0;
            return precoB - precoA;
        });
    }

    carregarProdutos(lista);
}

function renderCheckoutSection(cestoSec, total, lista) {
    const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
    const checkoutSec = document.createElement('section');
    checkoutSec.className = 'checkout';
    checkoutSec.setAttribute('aria-label', 'Secção de checkout');

    const totalEl = document.createElement('p');
    totalEl.className = 'checkout-total';
    const textoTotal = formatoEUR.format(total);
    totalEl.textContent = `Custo total: ${textoTotal}`;

    const estudanteWrap = document.createElement('label');
    estudanteWrap.htmlFor = 'checkout-estudante';
    estudanteWrap.textContent = 'És estudante do DEISI? ';

    const estudanteInput = document.createElement('input');
    estudanteInput.type = 'checkbox';
    estudanteInput.id = 'checkout-estudante';
    estudanteInput.checked = checkoutEstado.estudante;
    estudanteInput.addEventListener('change', () => {
        checkoutEstado.estudante = estudanteInput.checked;
    });
    estudanteWrap.appendChild(estudanteInput);

    const nomeLabel = document.createElement('label');
    nomeLabel.setAttribute('for', 'checkout-nome');
    nomeLabel.textContent = ' Nome: ';

    const nomeInput = document.createElement('input');
    nomeInput.type = 'text';
    nomeInput.id = 'checkout-nome';
    nomeInput.placeholder = 'o seu nome';
    nomeInput.value = checkoutEstado.nome;
    nomeInput.addEventListener('input', () => {
        checkoutEstado.nome = nomeInput.value;
    });

    const cupaoLabel = document.createElement('label');
    cupaoLabel.setAttribute('for', 'checkout-cupao');
    cupaoLabel.textContent = ' Cupão de desconto: ';

    const cupaoInput = document.createElement('input');
    cupaoInput.type = 'text';
    cupaoInput.id = 'checkout-cupao';
    cupaoInput.placeholder = 'ex.: black-friday';
    cupaoInput.value = checkoutEstado.cupao;
    cupaoInput.addEventListener('input', () => {
        checkoutEstado.cupao = cupaoInput.value;
    });

    const btnComprar = document.createElement('button');
    btnComprar.type = 'button';
    btnComprar.textContent = 'Comprar';
    btnComprar.disabled = lista.length === 0;

    const resultadoEl = document.createElement('p');
    resultadoEl.className = 'checkout-resultado';
    resultadoEl.textContent = checkoutEstado.mensagem;

    btnComprar.addEventListener('click', () => {
        processarCompra(lista, total, totalEl, resultadoEl, btnComprar);
    });

    checkoutSec.appendChild(totalEl);
    checkoutSec.appendChild(estudanteWrap);
    checkoutSec.appendChild(document.createElement('br'));
    checkoutSec.appendChild(nomeLabel);
    checkoutSec.appendChild(nomeInput);
    checkoutSec.appendChild(document.createElement('br'));
    checkoutSec.appendChild(cupaoLabel);
    checkoutSec.appendChild(cupaoInput);
    checkoutSec.appendChild(document.createElement('br'));
    checkoutSec.appendChild(btnComprar);
    checkoutSec.appendChild(resultadoEl);

    cestoSec.appendChild(checkoutSec);
}

async function processarCompra(lista, totalOriginal, totalEl, resultadoEl, botao) {
    if (!Array.isArray(lista) || lista.length === 0) {
        resultadoEl.textContent = 'Adicione produtos ao cesto antes de comprar.';
        checkoutEstado.mensagem = resultadoEl.textContent;
        return;
    }

    const produtosIds = lista.map((produto) => produto.id);
    const payload = {
        products: produtosIds,
        student: Boolean(checkoutEstado.estudante),
        coupon: checkoutEstado.cupao || '',
        name: checkoutEstado.nome || 'Cliente DEISI'
    };

    resultadoEl.textContent = 'A calcular o total...';
    checkoutEstado.mensagem = resultadoEl.textContent;
    botao.disabled = true;

    try {
        const resposta = await fetch(BUY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const dados = await resposta.json();
        if (!resposta.ok || dados.error) {
            const mensagemErro = dados?.error || 'Não foi possível concluir a compra.';
            resultadoEl.textContent = mensagemErro;
            checkoutEstado.mensagem = mensagemErro;
            return;
        }

        const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
        const totalOriginalTexto = formatoEUR.format(totalOriginal);
        const totalNumero = Number(dados.totalCost);
        const textoTotal = Number.isNaN(totalNumero) ? dados.totalCost : formatoEUR.format(totalNumero);
        totalEl.textContent = `Custo total: ${textoTotal}`;

        const houveDesconto = textoTotal !== totalOriginalTexto;
        let textoResultado = houveDesconto
            ? `Total com desconto: ${textoTotal} (antes ${totalOriginalTexto}).`
            : `Total final: ${textoTotal}.`;

        if (dados.reference) {
            textoResultado += ` Referência: ${dados.reference}.`;
        }

        if (dados.message) {
            textoResultado += ` ${dados.message}`;
        }

        resultadoEl.textContent = textoResultado;
        checkoutEstado.mensagem = textoResultado;

        // compra concluída, podemos limpar o cesto
        setCart([]);
        atualizaCesto();
        renderCestoCount();
    } catch (erro) {
        console.error(erro);
        const falha = 'Ocorreu um erro na ligação. Tente novamente.';
        resultadoEl.textContent = falha;
        checkoutEstado.mensagem = falha;
    } finally {
        botao.disabled = false;
    }
}


function carregarProdutos(lista) {
    const container = document.querySelector('#lista-produtos');
    if (!container || !Array.isArray(lista)) {
        return;
    }

    container.innerHTML = '';
    container.setAttribute('role', 'list');

    /*
    lista.forEach((produto) => {
      console.log(produto);
    });
    
    lista.forEach((produto) => {
      console.log('id:', produto.id, 'title:', produto.title);
    });
    */

    // Renderização dos artigos
    lista.forEach((produto) => {
        const artigo = criarProduto(produto);
        container.append(artigo);
    });
}

// Criacao de produtos

function criarProduto(produto) {
    const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

    const artigo = document.createElement('article');
    artigo.className = 'produto';
    artigo.setAttribute('role', 'listitem');
    artigo.dataset.id = String(produto.id);

    const img = document.createElement('img');
    img.src = produto.image;
    img.alt = `${produto.title} — categoria: ${produto.category}`;

    const h3 = document.createElement('h3');
    h3.textContent = produto.title;

    const descr = document.createElement('p');
    descr.className = 'descricao';
    descr.textContent = produto.description;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.dataset.preco = String(produto.price);
    preco.textContent = formatoEUR.format(produto.price);

    const rating = document.createElement('p');
    rating.className = 'rating';
    const rate = produto.rating?.rate ?? '?';
    const count = produto.rating?.count ?? 0;
    rating.textContent = `★ ${rate} (${count})`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Adicionar ao cesto';
    btn.ariaLabel = `Adicionar "${produto.title}" ao cesto`;
    btn.addEventListener('click', () => {
        addToCart(produto);
    });

    // Montagem do artigo
    artigo.appendChild(img);
    artigo.appendChild(h3);
    artigo.appendChild(descr);
    artigo.appendChild(preco);
    artigo.appendChild(rating);
    artigo.appendChild(btn);

    return artigo;
}



// Cesto de compras
function atualizaCesto() {
    const cestoSec = document.querySelector('#cesto');
    if (!cestoSec) return;

    const lista = getCart(); // vai ao localStorage
    cestoSec.innerHTML = '<h2>Cesto</h2><section id="cesto-lista" role="list"></section>';
    const listaEl = cestoSec.querySelector('#cesto-lista');

    if (lista.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'O cesto está vazio.';
        cestoSec.appendChild(p);
        renderCheckoutSection(cestoSec, 0, lista);
        return;
    }

    // criar artigos do cesto
    lista.forEach((produto) => {
        const artigo = criaProdutoCesto(produto);
        listaEl.appendChild(artigo);
    });

    // calcular total
    let total = 0;
    for (let produto of lista) {
        total += Number(produto.price) || 0;
    }

    renderCheckoutSection(cestoSec, total, lista);
}


function criaProdutoCesto(produto) {
    const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });


    const artigo = document.createElement('article');
    artigo.className = 'produto';
    artigo.setAttribute('role', 'listitem');
    artigo.dataset.id = String(produto.id);

    const img = document.createElement('img');
    img.src = produto.image;
    img.alt = `${produto.title}`;

    const h3 = document.createElement('h3');
    h3.textContent = produto.title;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.textContent = formatoEUR.format(produto.price);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Remover do cesto';
    btn.style.backgroundColor = '#e74c3c';
    btn.addEventListener('click', () => {
        const lista = getCart();
        const novaLista = lista.filter((p) => p.id !== produto.id);
        setCart(novaLista);
        atualizaCesto();
    });

    artigo.appendChild(img);
    artigo.appendChild(h3);
    artigo.appendChild(preco);
    artigo.appendChild(btn);

    return artigo;
}
-------------------------------------------------------------------------------------------
CSS:

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: black;
    color: white;
    text-align: center;
    padding: 10px;
    position: sticky;
    z-index: 1001;
    top: 0;

    h2 {
        display: flex;
        justify-content: space-between;
    }

    a {
        color: white;
        text-decoration: none;
        font-size: 18px;
        padding: 8px 12px;
        border-radius: 5px;
    }

    a:hover {
        background-color: grey;
    }

    a:active {
        background-color: darkgrey;
    }

    ul {
        list-style-type: none;
        display: flex;
        gap: 30px;
        margin-left: auto;
        margin-right: 20px;

        li {
            display: inline;


        }
    }
}

body {
    background-color: #edecec;
}

img {
    width: 300px;
}

footer {
    background-color: black;
    color: white;
    text-align: center;
    padding: 10px;
    position: relative;
    bottom: 0;
    width: 100%;
    position: fixed;
}

.section {
    height: 100vh;
    scroll-margin-top: 47.5px;

    @media (max-width: 768px){
        scroll-margin-top: 179.5px;
    }

}

.section-info {
    background-color: #939393;
    padding: 10px;
}




/* Hamburger Menu Styles */
.hamburguer {
    font-size: 30px;
    cursor: pointer;
    display: none;
}

@media (max-width: 600px) {

    header {
        flex-direction: column;
    }

    .header-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    nav {
        display: none;
    }

    header:hover nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background-color: black;

        a {
            flex-direction: column;
            color: white;
            text-decoration: none;
            font-size: 18px;
            padding: 8px 12px;
            border-radius: 5px;
        }

        ul {
            flex-direction: column;

            li {
                flex-direction: column;
                width: 100%;
            }
        }
    }


    .hamburguer {
        display: block;
    }
}

/* Layout principal */
.lista-produtos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 30px;
  background-color: #f8f8f8;
}

#cesto-lista {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 30px;
  background-color: #f8f8f8;
}

#cesto-lista .produto { width: 250px; }

/* Cada produto como card */
.produto {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 250px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.produto:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

/* Imagem do produto */
.produto img {
  max-width: 100%;
  height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
}

/* Título */
.produto h3 {
  font-size: 1.1em;
  margin: 10px 0 5px 0;
}

/* Descrição */
.produto .descricao {
  font-size: 0.95em;
  color: #555;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


.produto:hover .descricao {
  -webkit-line-clamp: unset; /* mostra tudo ao hover */
}
*/

/* Preço */
.produto .preco {
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

/* Rating */
.produto .rating {
  color: #f39c12;
  font-size: 0.9em;
}

/* Botão */
.produto button {
  margin-top: auto;
  background-color: #2d89ef;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.produto button:hover {
  background-color: #1b5fbf;
}

