//--------------CHECAR BUSCA POR ID-----------------------
//Se for por ID, pega o ID da URL, ou seja, o id do perfil que deseja ver, então define que a pagina está em busca por ID usando a variável id_search.
const params = new URLSearchParams(window.location.search);
let id = params.get('id');
let id_search = true;

if (id == null) {
    id_search = false;
    id = '';
}
console.log(`id: ${id}. ID Search: ${id_search}`);
//--------------------------------------------------------

//função para pegar o perfil do ponto turístico de acordo com o ID passado.
function getDescr(id) {
    const URL = `http://localhost:1337/api/atracaos/${id}`;  
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let detalhesElemento = document.getElementById('detalhes');
            let descricao = document.getElementById('descricao_detalhes');

            //console.log('Resposta da API:', data);

            const atracao = data.data.descricao;
            const endereco = data.data.endereco;
            const horario = data.data.horario;
            //console.log('Atração encontrada:', atracao);

            let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;

            detalhesElemento.innerHTML = `
                <p><i class="bi bi-geo-alt-fill"></i> Endereço: <a href="${mapsUrl}" target="_blank" id="endereco">${endereco}</a></p>
                <p><i class="bi bi-clock-fill"></i> Horário de Funcionamento: ${horario}</p>
            `;

            if (atracao) {
                descricao.innerHTML = atracao|| "Descrição não disponível.";
            } else {
                detalhesElemento.innerHTML = "Atração não encontrada.";
            }

            if (window.innerWidth < 600){
                detalhesElemento.innerHTML = '<a href="'+mapsUrl+'" target="_blank"><i class="bi bi-geo-alt-fill">Ver no mapa</a>';
            }
        
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('detalhes').innerHTML = "Erro ao carregar a descrição.";
        });
}

//função para pegar o nome do ponto turístico de acordo com o ID passado.
function getNome(id) {
    const URL = `http://localhost:1337/api/atracaos/${id}`;
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const nomeElemento = document.getElementById('nome');

            //console.log('Resposta da API:', data);

            const atracao = data.data.nome;
            //console.log('Nome da atração:', atracao);

            if (atracao) {
                nomeElemento.innerHTML = atracao || "Nome não disponível.";
            } else {
                nomeElemento.innerHTML = "Atração não encontrada.";
            }
        
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('nome').innerHTML = "Erro ao carregar o nome.";
        });
}

//função para pegar a avaliação do ponto turístico de acordo com o ID passado.
function getAvaliacao(id){
    const URL = `http://localhost:1337/api/atracaos/${id}?populate[avaliacaos][populate][avaliado_por][populate][0]=foto`;

    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            
            //console.log('Resposta reviews:', data);

            let reviews = data.data.avaliacaos;
            
            
            for (let i=0; i < reviews.length; i++){
                let nota = reviews[i].nota;
                let foto = 'http://localhost:1337';
                if (reviews[i].avaliado_por.foto) {
                    foto += reviews[i].avaliado_por.foto.url;
                }
    
                let nome = reviews[i].avaliado_por.nome;
                let descricao = reviews[i].descricao;
                let id = reviews[i].avaliado_por.documentId;
                let reviewElement = document.createElement('div');
                reviewElement.innerHTML = `
                <div class="info_comentario">
                    <img src="${foto} "class="avatar"></img>
                    <a href="../profile/profile.html?id=${id}">${nome}</a>
                    <div class="avaliacao">
                    <div class="stars"></div>
                        <span class="valor" style="display: none">${nota}</span>
                    </div>
                    </div>
                <p id="descricao">${descricao}</p>
                `;
                document.getElementById('avaliacao_usuario').appendChild(reviewElement);
            }
            stars_init(document.getElementsByClassName('stars'), document.getElementsByClassName('valor'));
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('avaliacoes').innerHTML = "Erro ao carregar as avaliações.";
        });
}

//função para pegar a imagem do ponto turístico de acordo com o ID passado.
function getImg(id){
    const URL = `http://localhost:1337/api/atracaos/${id}?populate=*`;   
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const imgElemento = document.getElementById('imagem');

            //console.log('Resposta da API:', data);

            const atracao = data.data;
            //console.log('Imagem da atração:', atracao);

            if (atracao) {
                imgElemento.src = `http://localhost:1337${atracao.foto[0].url}` || "Imagem não disponível.";
            } else {
                imgElemento.src = "Imagem não disponível.";
            }
        
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('imagem').src = "Erro ao carregar a imagem.";
        });
}

//listar guias disponiveis dentro de publics com populate
function getGuias(id){
    let guia = document.getElementById('guias');
    const URL = `http://localhost:1337/api/atracaos/${id}?populate[publics][populate][0]=foto`;
    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {

            //console.log('Resposta da API:', data);

            const guias = data.data.publics;
            console.log('Guias:', guias);
            
            for (let i=0; i < guias.length; i++){
                let foto = 'http://localhost:1337';
                if (guias[i].foto) {
                    foto += guias[i].foto.url;
                }
                let nome = guias[i].nome;
                let id = guias[i].documentId;
                let guiaElement = document.createElement('div');
                guiaElement.className = 'guia';
                guiaElement.innerHTML = `
                
                <div class="info_comentario">
                <img src="${foto} "class="avatar"></img>
                <a href="../profile/profile.html?id=${id}">${nome}</a>
                <!-- estrelas -->
                <div class="avaliacao">
                    <div class="stars"></div>
                    <span class="valor" style="display: none">${guias[i].nota}</span>
                </div>
                </div>
                
                `;
                guia.appendChild(guiaElement);
            }
            stars_init(document.getElementsByClassName('stars'), document.getElementsByClassName('valor'))
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('guias').innerHTML = "Erro ao carregar os guias.";
        });
}

//-------------------MAIN--------------------------
getImg(id);
getNome(id);
getDescr(id);
getAvaliacao(id);
getGuias(id);

if (estaLogado()) {
    avaliarButton(false, document.getElementById('avaliar'));
    let agendar = document.getElementById('agendar-guias');

    const method = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
        }
    };

    fetch('http://localhost:1337/api/users/me?populate=role&populate=usuario', method)
    .then(response => {
        if (!response.ok) throw new Error('Algo deu errado: ' + response.status);
        return response.json();
    })
    .then(data => {
        let guia = data.usuario.documentId;

        console.log(data);
        data.role.name == "Turista" ? agendar.style.display = 'none' : 
        document.getElementById('inserir-agendamento').addEventListener('click', () => {
            doAgendamento(id, guia).then(() => {
                location.reload();
            }).catch(error => {
                console.error('Erro ao agendar:', error);
            });
        });
        document.getElementById('remover-agendamento').addEventListener('click', () => {
            doDesagendamento(id, guia).then(() => {
                location.reload();
            }).catch(error => {
                console.error('Erro ao desagendar:', error);
            });
        });
    })
} 
else {
    document.getElementById('agendar-guias').style.display = 'none';
    document.getElementById('avaliar').style.display = 'none';
    document.getElementById('avaliacoes').innerHTML += '<h3>Para avaliar é necessário estar logado</h3>';
}
//------------------------------------------------
