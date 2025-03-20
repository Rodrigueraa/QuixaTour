
function changeTitle(str = 'Perfil') {
    document.title = "Quixada Tour - " + str;
}

if (sessionStorage.getItem('admin')) window.location.href = '../404';

publicUserId = sessionStorage.getItem('publicUserId');

//--------------CHECAR BUSCA POR ID-----------------------
//Se for por ID, pega o ID da URL, ou seja, o id do perfil que deseja ver, então define que a pagina está em busca por ID usando a variável id_search.
const params = new URLSearchParams(window.location.search);
id = params.get('id');
id_search = true;


let nodes = document.querySelectorAll('.profile .top > div');

if (id != null && id == publicUserId) { window.location.href = 'profile.html' };

if (id == null) {
    id_search = false;
    id = '';
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove('no-hover');
    }
} else {
    document.getElementsByClassName('email')[0].style.display = 'none';
    document.getElementsByClassName('senha')[0].style.display = 'none';
    let pens = document.getElementsByClassName('bi-pen');

    for (let i = 0; i < pens.length; i++) {
        pens[i].style.display = 'none';
    }


    for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.add('no-hover');
    }
}
console.log(`id: ${id}. ID Search: ${id_search}`);
//--------------------------------------------------------

if (!estaLogado()) {
    document.getElementById('avaliar-button').style.display = 'none';
}

if (!estaLogado() && !id_search) {
    requerAutenticacao();
}

console.log(`id: ${id}, publicUserId: ${publicUserId}`);
const API_URL = "http://localhost:1337/api";


function remove_name_border() {
    let border = document.getElementsByClassName('border');
    let content = document.querySelectorAll('aside.left .avaliacao-usuario .content');

    for (let i = 0; i < border.length; i++) {
        if (content[i].textContent === "") border[i].style.display = 'none';
    }
}

let g_pp, g_nome, g_nota, g_sexo, g_nascimento, g_textarea, g_email, g_parceria, g_nome_completo;

function formatTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ''); // Remove all non-digit characters
    if (telefone.length === 11) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 10) {
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}

function desformatTelefone(telefone) {
    return telefone.replace(/\D/g, '');
}

//Função para pegar o perfil do usuário de acordo com o token de autenticação. Se ID for passado, pega o perfil do usuário com o ID passado.
function getUserProfile(id = '') {

    function getParceria(data) {
        if (data.parceria == 0) return 'Turista';
        if (data.parceria == 1) return 'Guia';
        return 'Motorista';
    }

    //Requisição com populate, para pegar a relação que o usuário tem com a foto. É uma requisição com 2 níveis de populate. (essa sintaxe é muito feia)
    let requestUrl = `${API_URL}/users/me?populate[usuario][populate][0]=foto`;
    const method = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
        }
    };

    //Se for passado um ID, muda a URL da requisição para pegar o perfil do usuário com o ID passado.
    if (id_search) {
        fetch('http://localhost:1337/api/users/me', method)
        .then((response) => response.json())
        .then((response) => {
            fetch('http://localhost:1337/api/usuarios/' + id)
            .then((innerResponse) => innerResponse.json())
            .then((data) => {
                console.log('Dados:')
                console.log(response, data);
                if(response.parceria == '0') document.querySelector('.telefone').style.display = 'none';
                if (response.parceria == data.data.parceria) {
                    document.getElementById('avaliar-button').style.display = 'none';
                }
            });
        });


        method.method = 'GET';
        method.headers = { 'Content-Type': 'application/json' };
        requestUrl = `${API_URL}/usuarios/${id}?populate[0]=foto`
    }

    //Faz a requisição para pegar o perfil do usuário.
    fetch(requestUrl, method)
        .then((response) => {
            if (!response.ok) throw new Error('Algo deu errado');
            return response.json();
        })
        .then((response) => {
            console.log(response);
            let data = (id_search) ? response.data : response.usuario;
            const { nome, nota, sexo, nascimento, bio, foto, nome_completo, contato } = data;
            const parceria = getParceria(data);
            const fotoUrl = foto ? `http://localhost:1337${foto.url}` : '../src/img/user_example.png';
            const email = response.email;

            g_pp = document.getElementById('pp');
            g_nome = document.getElementById('apelido');
            g_nome_completo = document.querySelector('.nome .value');
            g_nota = document.getElementById('nota');
            g_sexo = document.querySelector('.sexo .value');
            g_nascimento = document.querySelector('.nascimento .value');
            g_textarea = document.querySelector('.textarea');
            g_email = document.querySelector('.email .value');
            g_parceria = document.querySelector('.parceria .value');
            g_contato = document.querySelector('.telefone .value');

            g_pp.src = fotoUrl;
            g_nome_completo.value = nome_completo;
            document.getElementById('apelido').value = nome.toUpperCase();
            g_nota.innerHTML = nota;
            g_sexo.value = sexo;
            g_nascimento.value = nascimento;
            g_textarea.value = bio;
            g_email.value = email;
            g_parceria.innerHTML = parceria;
            g_contato.value = formatTelefone(contato);

            setTimeout(() => {
                changeTitle(nome);
            }, 500);
        })
        .catch(error => console.log("Erro: " + error));
}

function getUserReviews() {

    //Requisição com 3 níveis de populate, para pegar as avaliações do usuário e quem fez a avaliação. (só piora a cada nível a sintaxe)
    let requestUrl = `${API_URL}/users/me?populate[usuario][populate][avaliacoes][populate][0]=avaliado_por`;
    let method = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
        }
    };

    //Ainda com problemas em pegar as avaliações quando passado por ID, então não está funcionando.
    if (id_search) {
        method.method = 'GET';
        method.headers = { 'Content-Type': 'application/json' };
        requestUrl = `${API_URL}/usuarios/${id}?populate[avaliacoes][populate][0]=avaliado_por`
    }

    fetch(requestUrl, method)
        .then((response) => {
            if (!response.ok) throw new Error('Algo deu errado: ' + response.status);
            return response.json();
        }).then((data) => {
            try {
                data = (id_search) ? data.data : data.usuario;
                const reviews = data.avaliacoes;
                if (reviews == undefined) return;

                const reviewsContainer = document.querySelector('aside.left .container');

                for (let i = 0; i < reviews.length; i++) {
                    let nomeAvaliador = reviews[i].avaliado_por.nome;
                    let idAvaliador = reviews[i].avaliado_por.documentId;
                    let nota = reviews[i].nota;
                    let descricao = reviews[i].descricao;

                    //Cria um elemento HTML para cada review e adiciona no container de reviews.
                    //Coloco o ID do usuário que fez a avaliação em um span com display none, para pegar o ID do usuário que fez a avaliação
                    //quando clicar no nome do usuário.
                    const reviewElement = document.createElement('article');
                    reviewElement.classList.add('avaliacao-usuario');
                    reviewElement.innerHTML = `
                        <div class="nome-nota">
                            <a href="profile.html?id=${idAvaliador}" class="nome">${nomeAvaliador}</a>
                            <span style="display: none" class="documentId"></span>
                            <div class="avaliacao">
                                <div class="stars"></div>
                                <span class="valor" style="display: none">${nota}</span>
                            </div>
                        </div>
                        <div class="border"></div>
                        <div class="content">${descricao}</div>
                    `;
                    reviewsContainer.appendChild(reviewElement);
                    remove_name_border();
                    stars_init(document.getElementsByClassName('stars'), document.getElementsByClassName('valor'));
                }
            } catch (error) {
                console.log("Erro: " + error);
            }
        }).then(async () => {
            if (!id_search) id = publicUserId;
            console.log('ID:', id);
            document.getElementById('nota').textContent = (await getMediaNota(id)).toFixed(2);
            stars_init(document.getElementsByClassName('stars'), document.getElementsByClassName('valor'));
            avaliarButton(true, document.querySelector('aside.left button'));
        })
        .catch(error => console.error('Erro ao carregar as reviews:', error));
}

function datePicker() {
    document.querySelector('label[for="nascimento"]').addEventListener('click', () => {
        try {
            let calendar = document.getElementById('nascimento');
            calendar.style.userSelect = 'none';
            calendar.showPicker();
            console.log(calendar.value);
        } catch (NotAllowedError) {
            //faz nada;
        }

    });
}

function updateUser() {

    function bringSave() {
        let container = document.querySelector('.salvar-container');
        container.style.transform = 'translateX(2%)';
    }

    function removeSave() {
        let container = document.querySelector('.salvar-container');
        container.style.transform = 'translateX(100%)';
    }

    function parseName(name) {
        let nameParsed;
        name.split(' ').forEach((word) => {
            word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            if (nameParsed) {
                nameParsed += ' ' + word;
            } else {
                nameParsed = word;
            }
        });
        return nameParsed;
    }

    let fields = document.querySelectorAll('.profile .top .value');

    fields = Array.from(fields);
    let apelido = document.getElementById('apelido');
    fields.push(apelido);
    let button = document.getElementById('salvar');
    let focus = false;
    fields.forEach((field) => {
        field.addEventListener('focus', () => {
            focus = true;
            bringSave();
        });
    });

    let foto = document.getElementById('foto');
    let fotoModified = false;
    let formData, arquivo;

    foto.addEventListener('change', async (event) => {
        async function compactarImagem(arquivo) {
            const opcoes = {
                maxSizeMB: 0.5, // Tamanho máximo do arquivo em MB
                maxWidthOrHeight: 800, // Largura ou altura máxima
                useWebWorker: true // Usa processamento em segundo plano
            };

            try {
                const imagemCompactada = await imageCompression(arquivo, opcoes);
                console.log('imagem compactada')
                return imagemCompactada;
            } catch (error) {
                console.error("Erro ao compactar a imagem:", error);
            }
        }

        arquivo = await compactarImagem(foto.files[0]);
        focus = true;
        fotoModified = true;
        bringSave();
        if (arquivo) {
            let pic = document.querySelector('.profile .img-fix img')
            pic.src = URL.createObjectURL(arquivo);
            formData = new FormData();
            formData.append('files', arquivo); // Adiciona o arquivo no FormData
            console.log(formData);
        }
    });

    fields.forEach((field) => {
        field.addEventListener('blur', () => {
            setTimeout(() => {
                if (!focus) removeSave();
            }, 500);
            focus = false;
        });
    });

    document.getElementById('salvar-cancelar').addEventListener('click', () => {
        window.location.reload();
    });

    document.getElementsByClassName('textarea')[0].addEventListener('focus', () => {
        bringSave();
        focus = true;
    });

    document.getElementsByClassName('textarea')[0].addEventListener('blur', () => {
        setTimeout(() => {
            if (!focus) removeSave();
        }, 500);
        focus = false;
    });

    document.getElementById('salvar').addEventListener('click', async () => {
        async function picEvaluate() {
            if (fotoModified) {
                let response = await fetch('http://localhost:1337/api/upload', { // Substitua com seu URL do Strapi
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
                    },
                    body: formData
                });
                return await response;
            }
        }

        let pic = await picEvaluate();
        if (pic) pic = await pic.json();
        let nome_completo = g_nome_completo.value;
        let nome = parseName(g_nome.value);
        let sexo = g_sexo.value;
        let nascimento = g_nascimento.value;
        let bio = g_textarea.value;
        let email = g_email.value;
        let parceria = g_parceria.textContent;
        let contato = desformatTelefone(g_contato.value);

        let data = {
            nome: nome,
            nome_completo: nome_completo,
            sexo: sexo,
            nascimento: nascimento,
            bio: bio,
            contato: contato,
        };

        if (pic && pic.length > 0) {
            data.foto = pic[0].id;
        }

        let requestUrl = `${API_URL}/usuarios/${publicUserId}?populate=*`;
        let method = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            },
            body: JSON.stringify({ data })
        };

        fetch(requestUrl, method)
            .then((response) => {
                if (!response.ok) {
                    response = response.json();
                    throw new Error('Algo deu errado: ' + response);
                }
                return response.json();
            })
            .then((response) => {
                console.log(response);
                alert('Perfil atualizado com sucesso!');
                window.location.reload();
            })
            .catch(error => console.log("Erro: " + error));
    });
}

datePicker();
getUserProfile(id);
getUserReviews();
if (!id_search) {
    updateUser();
} else {
    document.querySelectorAll('.profile .top label').forEach((field) => {
        //if its a date field
        if (field.getAttribute('for') === 'nascimento') {
            field.getElementsByClassName('value')[0].setAttribute('readonly', 'true');
        } else if (field.getAttribute('for') === 'sexo') {
            field.getElementsByClassName('value')[0].style.appearance = 'none';
        }
        field.classList.add('no-hover');
        field.style.pointerEvents = 'none';
    });

    document.querySelector('.profile .img-fix').style.pointerEvents = 'none';

    document.getElementsByClassName('textarea')[0].setAttribute('readonly', 'true');

    let apelido = document.getElementById('apelido');
    apelido.style.pointerEvents = 'none';
    apelido.setAttribute('readonly', 'true');
    apelido.classList.add('no-hover');
}