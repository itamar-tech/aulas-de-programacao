# Chatbot de Delivery com Venom Bot - Aula 1

Este repositório contém o código inicial para o projeto do Chatbot de Delivery usando o Venom Bot. Nesta primeira aula, configuraremos o ambiente de desenvolvimento e criaremos o primeiro script para conectar o bot ao WhatsApp.

## Pré-requisitos

Antes de começar, você precisará ter os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/get-npm) (gerenciador de pacotes do Node.js)
- [Visual Studio Code](https://code.visualstudio.com/) ou outro editor de código de sua preferência

## Passos para Configuração

1. **Clone o Repositório:**

   Clone este repositório na sua máquina local:
   ```bash
   git clone https://github.com/seu-usuario/chatbot-delivery-venom-bot.git
   cd chatbot-delivery-venom-bot
Instale as Dependências:

Navegue até o diretório do projeto e instale o Venom Bot:

bash
Copiar código
npm install venom-bot
Crie o Script Inicial:

Crie um arquivo chamado index.js no diretório raiz do projeto e adicione o seguinte código:

javascript
Copiar código
// Suporta ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create({
    session: 'session-name' // nome da sessão
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result); // objeto de sucesso retornado
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); // objeto de erro retornado
        });
    }
  });
}
Execute o Bot:

Para rodar o bot, use o seguinte comando no terminal:

bash
Copiar código
node index.js
Isso iniciará o Venom Bot e aguardará por mensagens. Quando alguém enviar "Hi" no WhatsApp, o bot responderá com "Welcome Venom 🕷". Certifique-se de que o número do WhatsApp esteja configurado corretamente.

Solucionando Problemas:

Se encontrar algum erro, verifique o console para mensagens de erro e certifique-se de que o WhatsApp Web está funcionando corretamente.

Próximos Passos
Na próxima aula, vamos implementar a saudação inicial e começar a coletar as informações básicas do usuário. Continue acompanhando o curso para aprender como construir um chatbot completo de delivery!

Referências
Documentação do Venom Bot