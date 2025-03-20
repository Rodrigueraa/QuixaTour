let form = document.getElementById('form');

async function getPublicUserId(authToken) {
    try {
        let response = await fetch('http://localhost:1337/api/users/me?populate[0]=usuario', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar usuário.');
        let data = await response.json();
        console.log(data);
        return data.usuario.documentId;
    } catch (error) {
        console.log(error.message);
    }
}

let URL = 'http://localhost:1337/api';

async function login(email, senha) {
    try {
        let response = await fetch(`${URL}/auth/local`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identifier: email,
                password: senha
            })
        });

        if (!response.ok) throw new Error('Email ou senha invalidos.');
        response = await response.json();

        try {
            let userResponse = await fetch(`${URL}/users/me?populate[0]=role`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${response.jwt}`
                }
            });
            userResponse = await userResponse.json();
            if (userResponse.role.type === 'admin') {
                throw new Error('Não permitido.');
            }
        } catch (error) {
            throw new Error(error.message);
        }

        console.log(response);
        sessionStorage.setItem('jwtToken', response.jwt);
        sessionStorage.setItem('userId', response.user.id);
        console.log(JSON.stringify(response));
        let publicUserId = await getPublicUserId(response.jwt);
        sessionStorage.setItem('publicUserId', publicUserId);
        console.log('Token:', response.jwt, 'User ID:', publicUserId);
        sessionStorage.setItem('privateId', response.user.documentId);
        console.log("publicUserId: " + sessionStorage.getItem('publicUserId'));

    } catch (error) {
        alert(error.message);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.getElementById('usuario').value;
    let senha = document.getElementById('senha').value;
    try {
        await login(email, senha);
        window.location.href = '../home';
    } catch (error) {
        alert(error.message);
    }
});
