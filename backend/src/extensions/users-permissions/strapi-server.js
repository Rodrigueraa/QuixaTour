"use strict";

module.exports = (plugin) => {
    let rawAuth = plugin.controllers.auth({ strapi });
    const auth = {
        ...rawAuth,
        register: async (ctx) => {
            let email = ctx.request.body.email.toLowerCase();
            let parceria = ctx.request.body.parceria;
            let telefone = ctx.request.body.telefone;
            let veiculo = ctx.request.body.veiculo ? true : false;
            if(!parceria) parceria = 0;
            delete ctx.request.body.parceria;
            delete ctx.request.body.telefone;
            delete ctx.request.body.veiculo;

            // Não retorna nada, então, nessa tela, não tenho acesso ao usuario criado.
            // Tenho acesso no afterCreate, mas não consigo acessar o parâmetro ctx para pegar a parceria.
            // Por isso, pego a parceria e o email, despacho o request e depois pego o usuario a partir do email, com o findMany. Gambiarra total.
            // O ideal seria pelo menos um findOne, mas como não tenho o usuario criado aqui, teria que ser num afterUpdate? Mas para fazer o update precisaria do ID,
            // que não tenho, que teria no afterUpdate mas sem o parâmetro parceria... Passei sólidas 8 horas pensando em como fazer isso e só consegui dessa forma.
            // Não é performático, mas é o que tem pra hoje.

            await rawAuth.register(ctx);
            
            console.log(`parceria: ${parceria}, email: ${email}`);

            let [result] = await strapi.entityService.findMany('plugin::users-permissions.user', {
                filters: { email: email }
            });

            console.log(result);

            // role and parceria creation logic
            let roles = Array(3);
            let rolesJson = await strapi.entityService.findMany('plugin::users-permissions.role');
            
            rolesJson.forEach(role => {
                if (role.type === 'turista')   roles[0] = role;
                if (role.type === 'guia')      roles[1] = role;
                if (role.type === 'motorista') roles[2] = role;
            });

            try {
                const fs = require('fs');
                const path = require('path');

                const userId = result.id;

                const publicProfileData = {
                    data: {
                        nome: result.username,
                        sexo: "Outro",          
                        owner: userId,
                        parceria: parceria,
                        contato: telefone,
                        veiculo: veiculo
                    }
                };

                await strapi.entityService.create('api::usuario.usuario', publicProfileData);
                await strapi.entityService.update('plugin::users-permissions.user', userId, {
                    data: { 
                        role: roles[parceria].id, 
                        parceria: parceria
                    }
                });

                const logFilePath = path.join(__dirname, '../../../../../../logs.txt');
                
                const currentTime = new Date().toISOString();
                fs.appendFileSync(
                    logFilePath,
                    `${currentTime} - POST: ${result.username} (${userId}) registrado através da Query API\n`
                );
            } catch (error) {
                console.error('Erro ao criar perfil público ou escrever no log:', error);
            }
        }
    };

    plugin.controllers.auth = auth;
    return plugin;
};
