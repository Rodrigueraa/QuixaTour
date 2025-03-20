

let filters = new URLSearchParams(window.location.search);
let search = filters.get('search');
let type = filters.get('type');
requestUrl = `http://localhost:1337/api/usuarios?${search ? `filters[nome][$containsi]=${search}&populate=*` : 'populate=*'}`;
document.addEventListener("DOMContentLoaded", () => {
    listarUsuarios();
    searchAtracao();
});


function updateURLParams(params) {
    const url = new URL('/frontend/listar/listar.html', window.location.origin);

    // Percorre os parâmetros recebidos e atualiza na URL
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    return url.toString();
}


async function listarUsuarios() {
    try {
        const response = await fetch(requestUrl);

        if (!response.ok) throw new Error(`Erro ao buscar usuários: ${response.status}`);

        const data = await response.json();
        exibirUsuarios(data.data);
    } catch (error) {
        console.error("Erro:", error);
    }
}

function exibirUsuarios(usuarios) {
    const container = document.querySelector(".container-usuarios");
    container.innerHTML = "";
    let soma = 0;

    usuarios.forEach(async (usuario) => {
        // Filtra usuários pelo tipo
        if (usuario.parceria != type) return;

        soma++;
        const usuarioCard = document.createElement("section");
        usuarioCard.classList.add("usuarios");

        let foto = '/frontend/src/img/user_example.png';
        if (usuario.foto) {
            foto = "http://localhost:1337" + usuario.foto.url;
        }

        let nota = await getMediaNota(usuario.documentId);

        // Verifica o tipo e gera o HTML apropriado
        if (type == 1) { // Guias
            usuarioCard.innerHTML = `
                <div class="perfilGuia perfil">
                    <img src="${foto}" alt="${usuario.nome}">
                    <h3><a href="../profile/profile.html?id=${usuario.documentId}">${usuario.nome}</a></h3>
                    <h4>${obterProfissao(usuario)}</h4>
                    <div class="stars"></div>
                    <span class="valor" style="display: none">${nota}</span>
                </div>
            `;
        } else if (type == 2) { 
            usuarioCard.innerHTML = `
                 <div class="perfilMotorista perfil">
                    <div class="img">
                    <img src="${foto}" alt="${usuario.nome}">
                    </div>
                    <h3><a href="../profile/profile.html?id=${usuario.documentId}">${usuario.nome}</a></h3>
                    <h4>${obterProfissao(usuario)}</h4>
                    <p><i class="bi bi-car-front-fill"></i> Veículo: ${usuario.veiculo ? 'Moto' : 'Carro'}</p>
                    <p><i class="bi bi-signpost"></i> Distância até você: <br>${Math.floor(Math.random() * 10) + 1} km</p>
                    <div class="stars"></div>
                    <span class="valor" style="display: none">${nota}</span>
                </div>
            `;
        }

        container.appendChild(usuarioCard);
        stars_init(document.getElementsByClassName('stars'), document.getElementsByClassName('valor'));
    });

    if (soma == 0) {
        document.querySelector('.not-found').style.display = 'block';
        document.getElementById('search').classList.add('big-search');
        document.querySelectorAll('.search-span').forEach(element => {
            element.style.display = 'inline';
        });
    } else {
        document.querySelector('.not-found').style.display = 'none';
        document.getElementById('search').classList.remove('big-search');
    }

    document.querySelector('.container-usuarios').style.gridTemplateColumns = `repeat(${soma > 4 ? 4 : soma}, 1fr)`;
}

function obterProfissao(data) {
    console.log(data)
    if (data.parceria == 0) return 'Turista';
    if (data.parceria == 1) return 'Guia';
    return 'Motorista';
}

function searchAtracao() {
    let searchBar = document.getElementById('search-bar');
    if (search) searchBar.value = search;
    let searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', () => {
        let searchValue = searchBar.value;
        window.location.href = updateURLParams({ search: searchValue, type: type });
    });

    let form = document.getElementById('search');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchValue = searchBar.value;
        window.location.href = updateURLParams({ search: searchValue, type: type });
    });
}