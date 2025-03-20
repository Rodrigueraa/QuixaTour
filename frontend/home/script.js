let filters = new URLSearchParams(window.location.search);
let search = filters.get('search');

requestUrl = `http://localhost:1337/api/atracaos?${search ? `filters[nome][$containsi]=${search}&populate=*` : 'populate=*'}`;
method = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log(requestUrl);

fetch(requestUrl, method)
    .then((response) => {
        if (!response.ok) throw new Error('Algo deu errado: ' + response.status);
        return response.json();
    }).then((data) => {
        console.log(data);
        atracao = data.data;
        if(atracao.length == 0){
            document.querySelector('.not-found').style.display = 'block';
            document.getElementById('search').classList.add('big-search');
            document.querySelectorAll('.search-span').forEach(element => {
                console.log(element);
                element.style.display = 'inline';
            });
        } else {
            document.querySelector('.not-found').style.display = 'none';
            document.getElementById('search').classList.remove('big-search');
        }

        for (let i = 0; i < atracao.length; i++) {
            let imgURL;
            if (!atracao[i].foto){
                imgURL = "../src/img/logo-placeholder-image.png";
            }
            else{
                imgURL = "http://localhost:1337"+atracao[i].foto[0].url;
            }
            let nome = atracao[i].nome;
           
            const atracaoElement = document.createElement('div');
            atracaoElement.innerHTML = `
                    <a href="../ponto_turistico/ponto_turistico.html?id=${atracao[i].documentId}" class="atracao-container">
                        <div>
                            <img src="${imgURL}" alt="${nome}">
                        </div>
                        <span><b>${nome}</b></span>
                    </a>
                    `;
            document.getElementById('content').appendChild(atracaoElement);
        }
        
        document.getElementById('content').style.gridTemplateColumns = `repeat(${atracao.length > 3 ? 3 : atracao.length}, 1fr)`;

    })
    .catch(error => console.error('Erro ao carregar as atracoes:', error));

function searchAtracao() {
    let searchBar = document.getElementById('search-bar');
    if(search) searchBar.value = search;
    let searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', () => {
        let searchValue = searchBar.value;
        window.location.href = `./index.html?search=${searchValue}`;
    });

    let form = document.getElementById('search');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchValue = searchBar.value;
        window.location.href = `./index.html?search=${searchValue}`;
    });
}

searchAtracao();

