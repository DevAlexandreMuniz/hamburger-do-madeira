/* --- ESTADO INICIAL E PERSISTÊNCIA DE DADOS --- */

let produtos = JSON.parse(localStorage.getItem('db_produtos')) || [
    { 
        id: 1, 
        nome: "Madeira Brasa Clássico", 
        descricao: "Hambúrguer artesanal 180g assado na brasa, queijo cheddar fatiado, cebola caramelizada no pão brioche selado.", 
        preco: 28.90, 
        imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" 
    },
    { 
        id: 2, 
        nome: "Bacon Defumado Supremo", 
        descricao: "Hambúrguer 180g na brasa, fatias generosas de bacon defumado na lenha de frutífera, queijo prato e maionese defumada.", 
        preco: 34.90, 
        imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=500&q=80" 
    },
    { 
        id: 3, 
        nome: "Costela na Lenha", 
        descricao: "Blend especial de costela 200g, queijo provolone derretido, picles artesanal e molho barbecue de madeira defumada.", 
        preco: 38.90, 
        imagem: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80" 
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