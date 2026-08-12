/* --- LÓGICA PRINCIPAL E INTERFACE DE USUÁRIO --- */

/* 1. API VIACEP E INTEGRAÇÃO DE ENDEREÇO */
const cepInput = document.getElementById('end-cep');
const cepStatus = document.getElementById('cep-status');

if (cepInput) {
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;

        const cleanCep = value.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            buscarViaCEP(cleanCep);
        }
    });
}

async function buscarViaCEP(cep) {
    cepStatus.style.display = 'block';
    cepStatus.textContent = 'Buscando endereço...';
    cepStatus.style.color = 'var(--secondary-color)';

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            cepStatus.textContent = 'CEP não encontrado!';
            cepStatus.style.color = '#ff4757';
            return;
        }

        document.getElementById('end-rua').value = data.logradouro || '';
        document.getElementById('end-bairro').value = data.bairro || '';
        document.getElementById('end-cidade').value = data.localidade || '';
        document.getElementById('end-uf').value = data.uf || '';
        
        cepStatus.textContent = 'Endereço localizado com sucesso!';
        cepStatus.style.color = '#2ed573';
        document.getElementById('end-numero').focus();

    } catch (error) {
        cepStatus.textContent = 'Erro ao consultar CEP.';
        cepStatus.style.color = '#ff4757';
    }
}

/* --- CONTROLE DE SELEÇÃO DE IMAGEM (URL OU ARQUIVO) --- */
        function toggleImageSource(type) {
            const urlBox = document.getElementById('img-url-box');
            const fileBox = document.getElementById('img-file-box');

            if (type === 'url') {
                urlBox.style.display = 'block';
                fileBox.style.display = 'none';
            } else {
                urlBox.style.display = 'none';
                fileBox.style.display = 'block';
            }
        }

        /* LEITURA DE ARQUIVO LOCAL DO COMPUTADOR VIA FILEREADER */
        document.getElementById('prod-img-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagemLocalBase64 = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                imagemLocalBase64 = '';
            }
        });

/* 2. ABAS DA APLICAÇÃO */
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(tb => tb.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    if (element) {
        element.classList.add('active');
    }

    if(tabId === 'tab-favoritos') renderizarFavoritos();
    if(tabId === 'tab-feedbacks') renderizarFeedbacks();
    if(tabId === 'tab-admin') renderizarAdmin();
}

/* 3. RENDERIZAÇÃO DO CARDÁPIO */
function calcularMediaNota(produtoId) {
    const avaliacoes = feedbacks.filter(f => f.lancheId === produtoId);
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce((acc, f) => acc + Number(f.nota), 0);
    return (soma / avaliacoes.length).toFixed(1);
}

function renderizarMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';

    produtos.forEach(prod => {
        const isFav = favoritos.includes(prod.id);
        const mediaNota = calcularMediaNota(prod.id);
        const estrelas = mediaNota > 0 ? '⭐ '.repeat(Math.round(mediaNota)) + `(${mediaNota})` : 'Sem avaliações ainda';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(${prod.id})">
                <i class="fa-solid fa-heart"></i>
            </button>
            <img src="${prod.imagem}" alt="${prod.nome}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${prod.nome}</h3>
                <div class="rating-stars">${estrelas}</div>
                <p class="product-desc">${prod.descricao}</p>
                <div class="product-bottom">
                    <span class="product-price">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-primary" onclick="adicionarAoCarrinho(${prod.id})"><i class="fa-solid fa-plus"></i> Pedir</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    populaSelectFeedbacks();
}

/* 4. FAVORITOS */
function toggleFavorito(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(fId => fId !== id);
    } else {
        favoritos.push(id);
    }
    salvarDados();
    renderizarMenu();
    renderizarFavoritos();
}

function renderizarFavoritos() {
    const container = document.getElementById('favoritos-container');
    if (!container) return;
    container.innerHTML = '';

    const prodsFav = produtos.filter(p => favoritos.includes(p.id));

    if(prodsFav.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum lanche favoritado ainda.</p>';
        return;
    }

    prodsFav.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${prod.nome}</h3>
                <p class="product-desc">${prod.descricao}</p>
                <div class="product-bottom">
                    <span class="product-price">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-primary" onclick="adicionarAoCarrinho(${prod.id})"><i class="fa-solid fa-plus"></i> Pedir</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/* 5. CARRINHO DE COMPRAS */
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const item = carrinho.find(i => i.id === id);

    if (item) {
        item.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarDados();
    atualizarCarrinho();
    abrirCarrinho();
}

function alterarQuantidade(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;

    item.quantidade += delta;
    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(i => i.id !== id);
    }

    salvarDados();
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    container.innerHTML = '';

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 20px 0;">Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div>
                    <div style="font-weight:700; color: var(--text-light);">${item.nome}</div>
                    <div style="font-size:0.85rem; color: var(--secondary-color); font-weight: 600;">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                    <div style="margin-top:8px; display:flex; align-items:center;">
                        <button class="qty-btn" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                        <span style="margin: 0 10px; font-weight: bold;">${item.quantidade}</span>
                        <button class="qty-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button style="color:var(--primary-color); background:none; border:none; cursor:pointer; font-size: 1.1rem;" onclick="alterarQuantidade(${item.id}, -${item.quantidade})"><i class="fa-solid fa-trash"></i></button>
            `;
            container.appendChild(el);
        });
    }

    const totalQtd = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
    const valorTotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);

    document.getElementById('cart-count').textContent = totalQtd;
    document.getElementById('cart-total-price').textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

/* 6. AVALIAÇÕES / FEEDBACKS */
function populaSelectFeedbacks() {
    const select = document.getElementById('fb-lanche-select');
    if (!select) return;
    select.innerHTML = '';
    produtos.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
    });
}

document.getElementById('feedback-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const lancheId = Number(document.getElementById('fb-lanche-select').value);
    const lanche = produtos.find(p => p.id === lancheId);

    const novoFeedback = {
        id: Date.now(),
        lancheId: lancheId,
        lancheNome: lanche.nome,
        usuario: usuario ? usuario.nome : 'Cliente Faminto',
        nota: document.getElementById('fb-nota').value,
        comentario: document.getElementById('fb-comentario').value,
        data: new Date().toLocaleDateString('pt-BR')
    };

    feedbacks.unshift(novoFeedback);
    salvarDados();
    renderizarFeedbacks();
    renderizarMenu();
    e.target.reset();
});

function renderizarFeedbacks() {
    const container = document.getElementById('feedbacks-container');
    if (!container) return;
    container.innerHTML = '';

    if (feedbacks.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Nenhum comentário enviado ainda.</p>';
        return;
    }

    feedbacks.forEach(f => {
        const el = document.createElement('div');
        el.className = 'feedback-item';
        el.innerHTML = `
            <div class="feedback-header">
                <span>${f.usuario} (${f.lancheNome})</span>
                <span style="color: var(--star-color);">${'⭐'.repeat(f.nota)}</span>
            </div>
            <p style="font-size:0.95rem; color: var(--text-light);">"${f.comentario}"</p>
            <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-top:6px;">Enviado em ${f.data}</span>
        `;
        container.appendChild(el);
    });
}

/* 7. AUTENTICAÇÃO E PERFIL */
const loginModal = document.getElementById('login-modal');
const loginOverlay = document.getElementById('login-overlay');

document.getElementById('open-login-btn')?.addEventListener('click', () => {
    loginModal.style.display = 'block';
    loginOverlay.classList.add('active');
    atualizarInterfaceModalLogin();
});

document.getElementById('close-login-btn')?.addEventListener('click', fecharModalLogin);
loginOverlay?.addEventListener('click', fecharModalLogin);

function fecharModalLogin() {
    loginModal.style.display = 'none';
    loginOverlay.classList.remove('active');
}

document.getElementById('login-type')?.addEventListener('change', (e) => {
    document.getElementById('address-group').style.display = e.target.value === 'admin' ? 'none' : 'block';
});

document.getElementById('save-login-btn')?.addEventListener('click', () => {
    const nome = document.getElementById('login-nome').value.trim();
    const tipo = document.getElementById('login-type').value;

    if (!nome) return alert('Por favor, informe seu nome.');

    let enderecoCompleto = '';
    if (tipo === 'cliente') {
        const cep = document.getElementById('end-cep').value;
        const rua = document.getElementById('end-rua').value;
        const numero = document.getElementById('end-numero').value;
        const comp = document.getElementById('end-complemento').value;
        const bairro = document.getElementById('end-bairro').value;
        const cidade = document.getElementById('end-cidade').value;
        const uf = document.getElementById('end-uf').value;
        
        enderecoCompleto = `${rua}, ${numero} ${comp ? '('+comp+')' : ''} - ${bairro}, ${cidade}/${uf} - CEP: ${cep}`;
    }

    usuario = {
        nome,
        tipo,
        endereco: enderecoCompleto,
        detalhesEndereco: {
            cep: document.getElementById('end-cep').value,
            rua: document.getElementById('end-rua').value,
            numero: document.getElementById('end-numero').value,
            complemento: document.getElementById('end-complemento').value,
            bairro: document.getElementById('end-bairro').value,
            cidade: document.getElementById('end-cidade').value,
            uf: document.getElementById('end-uf').value
        }
    };

    salvarDados();
    atualizarInterfaceUsuario();
    fecharModalLogin();
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
    usuario = null;
    salvarDados();
    atualizarInterfaceUsuario();
    fecharModalLogin();
    switchTab('tab-cardapio');
});

function atualizarInterfaceUsuario() {
    const userDisplay = document.getElementById('user-display');
    const adminTabBtn = document.getElementById('tab-admin-btn');

    if (usuario) {
        userDisplay.textContent = `Olá, ${usuario.nome}`;
        adminTabBtn.style.display = usuario.tipo === 'admin' ? 'inline-block' : 'none';
    } else {
        userDisplay.textContent = 'Visitante';
        adminTabBtn.style.display = 'none';
    }
}

function atualizarInterfaceModalLogin() {
    if (usuario) {
        document.getElementById('auth-forms').style.display = 'none';
        document.getElementById('user-profile-info').style.display = 'block';
        document.getElementById('prof-nome').textContent = usuario.nome;
        document.getElementById('prof-tipo').textContent = usuario.tipo === 'admin' ? 'Administrador' : 'Cliente';
        
        if (usuario.tipo === 'admin') {
            document.getElementById('prof-end-box').style.display = 'none';
        } else {
            document.getElementById('prof-end-box').style.display = 'block';
            document.getElementById('prof-endereco').textContent = usuario.endereco || 'Não informado';
        }
    } else {
        document.getElementById('auth-forms').style.display = 'block';
        document.getElementById('user-profile-info').style.display = 'none';
    }
}

/* 8. PAINEL ADMIN (PRODUTOS E VENDAS) */
document.getElementById('product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('prod-nome').value.trim();
    const descricao = document.getElementById('prod-desc').value.trim();
    const preco = parseFloat(document.getElementById('prod-preco').value);

    // LÓGICA DE DEFINIÇÃO DA IMAGEM: Usa a imagem local (Base64) se houver, caso contrário pega a URL
    const sourceType = document.querySelector('input[name="img-source-type"]:checked')?.value;
    let imagem = '';

    if (sourceType === 'file') {
        imagem = typeof imagemLocalBase64 !== 'undefined' ? imagemLocalBase64 : '';
    } else {
        imagem = document.getElementById('prod-img')?.value.trim() || '';
    }

    if (!nome || !descricao || isNaN(preco) || !imagem) {
        alert('Por favor, preencha todos os campos e selecione uma imagem válida (URL ou arquivo do computador).');
        return;
    }

    const novo = {
        id: Date.now(),
        nome,
        descricao,
        preco,
        imagem
    };

    produtos.push(novo);
    salvarDados();
    renderizarMenu();
    renderizarAdmin();

    // Limpa o formulário e a imagem temporária
    e.target.reset();
    if (typeof imagemLocalBase64 !== 'undefined') {
        imagemLocalBase64 = '';
    }
    if (typeof toggleImageSource === 'function') {
        toggleImageSource('url');
    }
});

function removerProduto(id) {
    produtos = produtos.filter(p => p.id !== id);
    salvarDados();
    renderizarMenu();
    renderizarAdmin();
}

function renderizarAdmin() {
    document.getElementById('admin-vendas-qtd').textContent = vendasMes.qtd;
    document.getElementById('admin-vendas-total').textContent = `R$ ${vendasMes.total.toFixed(2).replace('.', ',')}`;

    const container = document.getElementById('admin-products-list');
    if (!container) return;
    container.innerHTML = '';

    produtos.forEach(p => {
        const el = document.createElement('div');
        el.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--wood-light); padding: 12px 0;";
        el.innerHTML = `
            <div>
                <strong style="color:var(--text-light);">${p.nome}</strong> - <span style="color:var(--secondary-color);">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
            </div>
            <button style="background:var(--primary-color); color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold;" onclick="removerProduto(${p.id})">Remover</button>
        `;
        container.appendChild(el);
    });
}

/* 9. FINALIZAÇÃO DE PEDIDO VIA WHATSAPP */
document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (carrinho.length === 0) return alert('Seu carrinho está vazio!');

    let msg = "🔥 *NOVO PEDIDO - HAMBÚRGUER DO MADEIRA* 🔥\n_No brasa, mais sabor!_\n\n";

    if (usuario) {
        msg += `*Cliente:* ${usuario.nome}\n`;
        if(usuario.endereco) msg += `*Endereço:* ${usuario.endereco}\n`;
    }

    msg += "\n*Itens do Pedido:* \n";
    carrinho.forEach(item => {
        msg += `• ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });

    const valorTotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    msg += `\n*Total a Pagar: R$ ${valorTotal.toFixed(2).replace('.', ',')}*`;

    vendasMes.qtd += 1;
    vendasMes.total += valorTotal;
    
    salvarDados();
    carrinho = [];
    salvarDados();
    atualizarCarrinho();
    fecharCarrinho();

    const fone = "5569999805404"; // Insira seu número com DDD
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, '_blank');
});

/* 10. CONTROLE DO CARRINHO LATERAL */
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');

function abrirCarrinho() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
}

function fecharCarrinho() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
}

document.getElementById('open-cart-btn')?.addEventListener('click', abrirCarrinho);
document.getElementById('close-cart-btn')?.addEventListener('click', fecharCarrinho);

/* 11. INICIALIZAÇÃO DA APLICAÇÃO */
renderizarMenu();
atualizarCarrinho();
atualizarInterfaceUsuario();