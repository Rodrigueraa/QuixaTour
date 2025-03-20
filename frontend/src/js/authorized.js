// Vê se o usuário está logado, se não, redireciona para a página de erro 404.
// Prefere-se fazer no backend, mas ainda não sei como fazer.

function requerAutenticacao() {
    if(!sessionStorage.getItem('jwtToken')) {
        window.location.replace('../404');
    }
}

function estaLogado() {
    return sessionStorage.getItem('jwtToken');
}

function logout() {
    if (confirm('Tem certeza que deseja encerrar a sessão?')) {
        sessionStorage.removeItem('jwtToken');
        window.location.href = '../home';
    }
}

function checkAdminRole() {
    fetch('http://localhost:1337/api/users/me?populate=role', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Algo deu errado: ' + response.status);
        return response.json();
    })
    .then(data => {
        let role = data.role.type;
        if (role !== 'admin') {
            window.location.href = './login.html';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function checkAdminBool() {
    fetch('http://localhost:1337/api/users/me?populate=role', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Algo deu errado: ' + response.status);
        return response.json();
    })
    .then(data => {
        let role = data.role.nome;
        if (role !== 'admin') {
            return false;
        }
        return true;
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}