let title = document.title;

class Loader {
    static init() {
        document.title = 'Carregando...';
        let loaderContainer = document.getElementById('loader-container');
        let bodyoverflow = document.body.style.overflow;
        let style = document.createElement('style');
        style.innerHTML = `
            body {
                overflow: hidden;
            }

            #loader-container {
                overflow: hidden;
                position: fixed;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: rgb(245, 228, 206);
                z-index: 255;
                display: flex;
                justify-content: center;
                align-items: center;
                display: none;
            }

            #loader-container .loader {
                border: 16px solid #cfcfcf; /* Light grey */
                border-top: 16px solid #008be8; /* Blue */
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
            }
  
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        loaderContainer.innerHTML = `
        <div class="loader"></div>
    `;
    }

    static show() {
        let loader = document.getElementById('loader-container');
        loader.style.display = 'flex';
    }

    static hide() {
        let loader = document.getElementById('loader-container');
        loader.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.title = title;
    }
}

Loader.init();
Loader.show();
setTimeout(() => {
    Loader.hide();
}, 650);