async function doAgendamento(atracao, guia, desagendar = false) {
    try {
        let URL = `http://localhost:1337/api/atracaos/${atracao}`;
        let response = await fetch(URL + '?populate=publics')
        
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);

        let guias_existentes = [];
        let data = await response.json();
        let guias = data.data.publics;
        for (let i = 0; i < guias.length; i++) {
            console.log(guias[i]);
            guias_existentes.push(guias[i].documentId);
        }
        
        if (guias_existentes.includes(guia)) {
            desagendar = true;
        }

        if (desagendar) {
            guias_existentes = guias_existentes.filter(item => item !== guia);
            console.log('Guias existentes:', guias_existentes);
        } else {
            guias_existentes.push(guia);
        }

        let method = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            },
            body: JSON.stringify({
                data: {
                    publics: guias_existentes
                }
            })
        };

        let responsePUT = await fetch(URL, method);

        if (!responsePUT.ok) throw new Error(responsePUT.statusText);

        let answer = await responsePUT.json();
        console.log('Resposta da API:', answer);

        return response;
    } catch (error) {
        console.error(error);
    }
}

async function doDesagendamento(atracao, guia) {
    return await doAgendamento(atracao, guia, true);
}