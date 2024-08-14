const venom = require('venom-bot');
const MessageController = require('./src/controllers/messageController');

venom
  .create({
    session: 'session-name', // Nome da sessão
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log('Erro na criação do Venom: ', erro);
  });

function start(client) {
  const messageController = new MessageController();

  client.onMessage(async (message) => {
    if (!message.isGroupMsg) { // Ignora mensagens de grupo
      const response = messageController.handleIncomingMessage(message);

      if (response) {
        // Envia a resposta como texto
        await client
          .sendText(message.from, response)
          .then((result) => {
            console.log('Mensagem enviada: ', result);
          })
          .catch((erro) => {
            console.error('Erro ao enviar mensagem: ', erro);
          });
      }
    }
  });
}
