/* --- ESTADO INICIAL E PERSISTÊNCIA DE DADOS --- */

let produtos = JSON.parse(localStorage.getItem('db_produtos')) || [
    { 
        id: 1, 
        nome: "Madeira Clássico", 
        descricao: "Hambúrguer artesanal 180g assado na brasa, queijo cheddar fatiado, cebola caramelizada no pão brioche selado.", 
        preco: 24.90, 
        imagem: "assets/imagens/madeira-classico.jpg" 
    },
    { 
        id: 2, 
        nome: "Bacon Defumado Supremo", 
        descricao: "Hambúrguer 180g na brasa, fatias generosas de bacon defumado na lenha de frutífera, queijo prato e maionese defumada.", 
        preco: 34.90, 
        imagem: "assets/imagens/bacon-supremo-defumado.jpeg" 
    },
    { 
        id: 3, 
        nome: "Costela na Lenha", 
        descricao: "Blend especial de costela 200g, queijo provolone derretido, picles artesanal e molho barbecue de madeira defumada.", 
        preco: 38.90, 
        imagem: "assets/imagens/costela-na-lenha.jpg" 
    },
    { 
        id: 4, 
        nome: "Bacon Crocante", 
        descricao: "Blend bovino 180g, generosas fatias de bacon crocante, queijo cheddar fatiado e maionese verde da casa no pão brioche.", 
        preco: 32.90, 
        imagem: "assets/imagens/bacon.png" 
    },
    { 
        id: 5, 
        nome: "Olimpo Grego", 
        descricao: "Blend de carneiro com especiarias 180g, queijo feta, tomate, cebola roxa, alface americana e molho tzatziki no pão com gergelim.", 
        preco: 36.90, 
        imagem: "assets/imagens/grego-tradicional.png" 
    },
     { 
        id: 7, 
        nome: "Monstro da Brasa", 
        descricao: "Dois blends de 150g, queijo cheddar, bacon, ovo frito, presunto, alface, tomate, milho, batata palha e maionese especial.", 
        preco: 44.90, 
        imagem: "assets/imagens/hamburguer-tudao.jpg" 
    },
    { 
        id: 8, 
        nome: "Tropical Caramelizado", 
        descricao: "Blend bovino 180g, queijo coalho grelhado, fatia de abacaxi caramelizado, bacon e maionese de pimenta doce no pão australiano.", 
        preco: 35.90, 
        imagem: "assets/imagens/hamburguer-tropical.jpg" 
    },
    { 
        id: 6, 
        nome: "Combo Madeira do Chef", 
        descricao: "Cheeseburger tradicional (blend 150g e queijo prato), acompanhado de batata frita média crocante e refrigerante lata 350ml.", 
        preco: 42.90, 
        imagem: "assets/imagens/combo-classico.jpg" 
    },
     { 
        id: 9, 
        nome: "Refrigerante Gelado 350ml", 
        descricao: "Lata de 350ml trincando de gelada. Escolha entre Coca-Cola, Guaraná Antarctica ou Fanta Laranja.", 
        preco: 6.50, 
        imagem: "assets/imagens/refrigerante-lata.jpg" 
    },
    { 
        id: 10, 
        nome: "Suco Natural da Fruta 500ml", 
        descricao: "Suco 100% natural de laranja espremido na hora, sem adição de açúcares ou conservantes.", 
        preco: 9.90, 
        imagem: "assets/imagens/suco-laranja.jpeg" 
    },
     { 
        id: 11, 
        nome: "Shake de Avelã Premium", 
        descricao: "Cremoso milkshake feito com sorvete artesanal de baunilha, Nutella pura e chantilly.", 
        preco: 18.90, 
        imagem: "assets/imagens/milkshake-nutella.jpg" 
    },
    { 
        id: 12, 
        nome: "IPA Lúpulo Artesanal 500ml", 
        descricao: "Cerveja artesanal estilo IPA, amargor equilibrado e notas cítricas. Perfeita para harmonizar com hambúrgueres.", 
        preco: 22.00, 
        imagem: "assets/imagens/cerveja-ipa.jpg" 
    }
];

let carrinho = JSON.parse(localStorage.getItem('db_carrinho')) || [];
let favoritos = JSON.parse(localStorage.getItem('db_favoritos')) || [];
let feedbacks = JSON.parse(localStorage.getItem('db_feedbacks')) || [];
let usuario = JSON.parse(localStorage.getItem('db_usuario')) || null;
let vendasMes = JSON.parse(localStorage.getItem('db_vendas')) || { qtd: 18, total: 582.40 };

 /* VARIÁVEL AUXILIAR PARA GUARDAR IMAGEM DO COMPUTADOR (BASE64) */
let imagemLocalBase64 = '';

function salvarDados() {
    localStorage.setItem('db_produtos', JSON.stringify(produtos));
    localStorage.setItem('db_carrinho', JSON.stringify(carrinho));
    localStorage.setItem('db_favoritos', JSON.stringify(favoritos));
    localStorage.setItem('db_feedbacks', JSON.stringify(feedbacks));
    localStorage.setItem('db_usuario', JSON.stringify(usuario));
    localStorage.setItem('db_vendas', JSON.stringify(vendasMes));
}