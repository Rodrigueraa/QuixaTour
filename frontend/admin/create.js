if(!estaLogado()) window.location.href = './login.html';
checkAdminRole();
setTimeout(() => {
    document.body.style.display = 'block';
}, 500);

let params = new URLSearchParams(window.location.search);

let id = params.get('id');
let nome = params.get('nome');

if(id) {
    document.querySelector('h4').innerText = `Editar ${nome}`;
    document.getElementById('submit').innerText = 'Editar';
}

let arquivo;
let formData = new FormData();

document.getElementById('foto').addEventListener('change', async (e) => {

    let foto = e.target.files[0];

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
    arquivo = await compactarImagem(foto);
    formData.append('files', arquivo);
});


document.getElementById('form').addEventListener('submit', async (e) => {

    e.preventDefault();
    try{
        async function picEvaluate() {
            let response = await fetch('http://localhost:1337/api/upload', { 
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
                },
                body: formData
            });
            return await response;
        }

        let pic = await picEvaluate();
        if(pic) pic = await pic.json();

        let URL = `http://localhost:1337/api/atracaos` + (id ? `/${id}` : '');   
        fetch(`${URL}`, {
            method: id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            },
            body: JSON.stringify({
                data: {
                    nome: document.getElementById('name').value,
                    descricao: document.getElementById('description').value,
                    endereco: document.getElementById('address').value,
                    horario: document.getElementById('horario').value,
                    foto: pic[0].id,
                }
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            //window.location.href = 'list.html';
        });
    }catch(error){
        alert("Erro:", error);
    }
});