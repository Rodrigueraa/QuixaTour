window.onload = function() {
    document.body.classList.add('loaded');
};

function isTokenValid(token) {
    if(!token) return false;
    let payload = token.split('.')[1];
    payload = atob(payload);
    payload = JSON.parse(payload);
    let exp = payload.exp;
    let now = Date.now() / 1000;
    return now < exp;
}

let token = sessionStorage.getItem('jwtToken');
let login_text;


fetch("../src/nav/navbar.html")
.then(response => response.text())
.then(data => {
    document.getElementById("navbar").innerHTML = data;
    
    if(token || isTokenValid(token)) {
            login_text = document.getElementById('log-in-out');

            login_text.style.textDecoration = 'none';
            login_text.style.cursor = 'default';
            login_text.innerHTML = '';
            login_text.removeAttribute('href');
            login_text.onclick = '';

            let profile_logout = document.createElement('div');
            profile_logout.innerHTML = `
                <a id="profile" href="../profile/profile.html">Perfil</a>
                <span> | </span>
                <a id="logout">Sair</a>
            `;
            
            login_text.appendChild(profile_logout);
            document.getElementById('logout').addEventListener('click', () => {
                sessionStorage.removeItem('jwtToken');
                sessionStorage.removeItem('userId');
                sessionStorage.removeItem('publicUserId');
                window.location.href = '../home/index.html';
            });
        }
    })
    .catch(error => console.error('Erro ao carregar o navbar:', error));

