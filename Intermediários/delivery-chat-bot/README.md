# Sistema de Pedidos com Venom Bot

Este projeto implementa um sistema de pedidos automatizado utilizando o `venom-bot` para interações via WhatsApp. Ele permite que os usuários façam pedidos, visualizem pedidos existentes e cancelem pedidos através de um fluxo de mensagens.

## Índice

- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura do Código](#estrutura-do-código)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Instalação

### Pré-requisitos

Antes de começar, você precisará ter o Node.js instalado em sua máquina. Você pode baixá-lo [aqui](https://nodejs.org/).

### Passos de Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/venom-bot-sistema-pedidos.git
    cd venom-bot-sistema-pedidos
    ```

2. Instale as dependências do projeto:

    ```bash
    npm install
    ```

3. Crie a estrutura de diretórios e o arquivo de pedidos:

    ```bash
    mkdir -p data
    echo "[]" > data/orders.json
    ```

## Uso

### Inicializando o Bot

Para iniciar o sistema de pedidos:

1. Execute o comando abaixo para iniciar o Venom Bot:

    ```bash
    npm start
    ```

2. Escaneie o QR code que será exibido no terminal usando o WhatsApp para conectar a sessão.

3. O bot estará pronto para interagir com os usuários através do WhatsApp.

### Fluxo de Interação

- **Passo 1:** O bot solicita o nome do usuário.
- **Passo 2:** Apresenta um menu com opções para fazer um pedido, ver pedidos existentes ou sair.
- **Passo 3:** No caso de um pedido, o usuário escolhe um item do cardápio e define a forma de pagamento.
- **Passo 4:** O usuário fornece o endereço para entrega e o pedido é registrado.

## Estrutura do Código

O projeto está estruturado da seguinte forma:

- `src/controllers/orderController.js`: Controla a criação e a recuperação dos pedidos armazenados em um arquivo JSON.
- `src/controllers/messageController.js`: Gerencia a lógica de interação com o usuário, processando as mensagens recebidas e respondendo de acordo com o fluxo definido.
- `index.js`: Arquivo principal que inicializa o bot e gerencia a sessão do Venom Bot.

### Arquivo `orderController.js`

- **createOrder(orderDetails):** Cria um novo pedido e o salva em um arquivo JSON.
- **getOrderById(orderId):** Recupera um pedido específico pelo ID.
- **_getAllOrders():** Retorna todos os pedidos armazenados.
- **_saveOrders(orders):** Salva os pedidos em um arquivo JSON.

### Arquivo `messageController.js`

- **handleIncomingMessage(message):** Processa a mensagem recebida e define a próxima etapa da interação.
- **_createMenuOptions():** Gera o menu de opções para o usuário.
- **_getMenuItem(option):** Retorna o item de menu selecionado pelo usuário.
- **_getPaymentMethod(option):** Retorna a forma de pagamento escolhida.
- **_viewOrders(userId):** Exibe os pedidos existentes do usuário.
- **_generateOrderNumber():** Gera um número de pedido aleatório.

### Arquivo `index.js`

Este arquivo inicializa o Venom Bot e define a lógica para ouvir e responder às mensagens.

## Contribuição

Contribuições são bem-vindas! Para contribuir, por favor, faça um fork do repositório, crie uma nova branch com suas melhorias e envie um pull request.

