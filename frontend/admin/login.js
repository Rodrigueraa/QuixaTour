URL = `http://localhost:1337`

async function login(identifier, password) {
    const response = await fetch(URL + '/api/auth/local', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
    });

    if (!response.ok) {
        throw new Error('Email ou senha inválidos');
    }
    
    const data = await response.json();

    const userResponse = await fetch(URL + '/api/users/me?populate=*', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.jwt}`
        }
    });

    if (!userResponse.ok) {
        throw new Error('Erro ao buscar usuário');
    }

    const userData = await userResponse.json();

    if (userData.role.type !== 'admin') {
        throw new Error('Access denied: Admins only');
    }

    sessionStorage.setItem('jwtToken', data.jwt);

    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = form.email.value;
        const password = form.password.value;
        try {
            const data = await login(email, password);
            window.location.href = './index.html';
        } catch (error) {
            alert(error.message);
        }
    });
});
