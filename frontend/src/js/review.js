
function put_stars(container, value = 0) { 
    value = Math.max(0, Math.min(5, value)); // Garante que o valor está entre 0 e 5

    let valueContainer = container.querySelector(".valor"); // Busca o span interno
    let valueText = valueContainer ? valueContainer.outerHTML : ""; // Salva o span

    let starsHTML = ""; // Constrói as estrelas sem sobrescrever tudo
    let aux = !isNaN(value) ? value : 0;

    while (value > 0) {
        starsHTML += (value < 0.8) ? `<i class="bi bi-star-half"></i>` : `<i class="bi bi-star-fill"></i>`;
        value--;
    }
    for (let i = 0; i < (5 - Math.ceil(aux)); i++) {
        starsHTML += `<i class="bi bi-star"></i>`;
    }

    container.innerHTML = starsHTML + valueText; // Reinsere o span no final
}

function stars_init(containers, valores) {
    for (let i = 0; i < containers.length; i++) {
        put_stars(containers[i], parseFloat(valores[i].textContent));
    }
};

function stars_hover(container) {
    let valueContainer = container.querySelector(".valor");
    put_stars(container, valueContainer.textContent);
    let stars = container.querySelectorAll("i");
    let value = valueContainer.textContent;

    let inContainer = false;
    let index;
    container.addEventListener("mouseover", (event) => {
        let stars = container.getElementsByClassName("bi");
        let oldIndex = [...stars].indexOf(event.target);
        let bool = !inContainer || index != oldIndex;
        if(bool) {
            console.log(`${oldIndex} ${index} ${bool}`);
            inContainer = true;
            console.log('Mouse entrou no contêiner');
            index = oldIndex;
            if (index !== -1) {
                starValue = index + 1;
                console.log("Valor no hover:", starValue);
                put_stars(container, starValue);
                value = starValue;
            }
        }
    });

    container.addEventListener("mouseleave", () => {
        inContainer = false;
        console.log('Mouse saiu do contêiner');
        put_stars(container, valueContainer.textContent);
    });

    container.addEventListener("click", () => {
        valueContainer.style.color = "blue";
        valueContainer = container.querySelector(".valor");
        valueContainer.textContent = value;
        console.log("Valor final:", valueContainer.textContent);
        put_stars(container, valueContainer.textContent); 
    });
}

// Função para pegar a média das avaliações de um usuário. O certo seria fazer isso no backend, mas por enquanto está aqui.

async function getMediaNota(id, type='usuarios') {
    try {
        let response = await fetch(`http://localhost:1337/api/${type}/${id}?populate[0]=${type=='atracaos' ? 'avaliacaos' : 'avaliacoes'}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        let soma = 0;

        let data = await response.json();
        let avaliacoes = data.data.avaliacoes || [];
        console.log(avaliacoes)

        if (avaliacoes.length === 0) {
            return 5;
        }

        avaliacoes.forEach(avaliacao => {
            soma += avaliacao.nota;
        });

        return soma / avaliacoes.length;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return 5;
    }
}