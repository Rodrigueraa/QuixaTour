// const { filter, pop } = require("../../../../../config/middlewares");

// module.exports = {
//     async afterCreate(event) {
//         const { result } = event;
//         await updateUserAverageRating(result.documentId); // Atualiza a média do usuário avaliado
//     },

//     async afterUpdate(event) {
//         const { result } = event;
//         await updateUserAverageRating(result.id); // Atualiza a média do usuário avaliado
//     },

//     async afterDelete(event) {
//         const { result } = event;
//         await updateUserAverageRating(result.documentId); // Atualiza a média do usuário avaliado
//     },
// };

// // Função para calcular e atualizar a média das notas do usuário
// async function updateUserAverageRating(reviewId) {

//     let avaliacao = await strapi.entityService.findOne('api::avaliacao.avaliacao', reviewId, {
//         populate: 'avaliando_usuario',
//     });

//     console.log(JSON.stringify(avaliacao, null, 2));

//     // console.log(avaliando_usuario.id);

//     // const avaliacoes = await strapi.entityService.findMany('api::avaliacao.avaliacao', {
//     //     populate: 'avaliando_usuario',
//     //     filters: { avaliando_usuario: avaliando_usuario.id },
//     // });

//     // // Calcula a média das notas
//     // const totalNotas = avaliacoes.reduce((sum, avaliacao) => sum + avaliacao.nota, 0);
//     // const mediaNotas = avaliacoes.length > 0 ? totalNotas / avaliacoes.length : 0;

//     // // Atualiza o campo 'media_notas' do usuário
//     // await strapi.entityService.update('api::usuario.usuario', avaliando_usuario.id, {
//     //   data: {
//     //     nota: mediaNotas,
//     //   },
//     // });
// }