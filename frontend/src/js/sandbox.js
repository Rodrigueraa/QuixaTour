async function createPublicProfile() {
    const publicProfileData = {
        data: {
            publics: [],
        }
    };

    // Criando perfil público do usuário
    const publicResponse = await fetch("http://localhost:1337/api/atracaos/elfui5qk9u8d0owgxuxupc96", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImlhdCI6MTc0MDE5OTk4MywiZXhwIjoxNzQyNzkxOTgzfQ.Eiy1_aHdWWoZ40_bPTRqgARaBF7o7zsYzC6CG8b72_w`
        },
        body: JSON.stringify(publicProfileData),
    });

    if (!publicResponse.ok) {
        throw new Error(publicResponse.statusText);
    }
    const publicDataResponse = await publicResponse.json();

    console.log("🔍 Resposta da API do Strapi:", publicDataResponse);

}

createPublicProfile();