if(!estaLogado()) window.location.href = './login.html';
checkAdminRole();
setTimeout(() => {
    document.body.style.display = 'block';
}, 500);


function logout() {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('admin');
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
    let users = document.getElementById('users');
    users.addEventListener('click', () => {
        console.log('users');
        window.location.href = './list.html?type=users';
    });

    let atracaos = document.getElementById('atracaos');
    atracaos.addEventListener('click', () => {
        console.log('atracaos');
        window.location.href = './list.html?type=atracaos';
    });

    let avaliacoes = document.getElementById('avaliacoes');
    avaliacoes.addEventListener('click', () => {
        console.log('avaliacoes');
        window.location.href = './list.html?type=avaliacaos';
    });
});

async function carregarUsuarios() {
    try {
        const response = await fetch('http://localhost:1337/api/usuarios');

        if (!response.ok) {
            throw new Error(`Erro ao buscar usuários: ${response.status}`);
        }

        const data = await response.json();
        exibirUsuarios(data.data); 
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao carregar usuários. Tente novamente mais tarde.");
    }
}

function exibirUsuarios(usuarios) {
    const usersSection = document.getElementById("users");

    usersSection.innerHTML = `
        <h2>Users</h2>
        <p>Manage your users here.</p>
        <table id="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Gender</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- As linhas serão inseridas aqui dinamicamente -->
            </tbody>
        </table>
    `;

    const usersTable = document.getElementById("users-table").getElementsByTagName('tbody')[0];

    for (const usuario of usuarios) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuario.documentId}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.contato}</td>
            <td>${usuario.parceria}</td>
            <td>${usuario.sexo}</td>
            <td>
                <a href="editar-usuario.html?documentId=${usuario.documentId}">Editar</a>
            </td>
        `;
        usersTable.appendChild(tr);
    }
}
