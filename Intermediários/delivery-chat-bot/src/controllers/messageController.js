const OrderController = require('./orderController');

class MessageController {
  constructor() {
    this.sessions = {}; // Inicializa as sessões
    this.orderController = new OrderController(); // Instancia o OrderController
  }

  handleIncomingMessage(message) {
    const userId = message.from;
    if (!this.sessions[userId]) {
      this.sessions[userId] = { step: 'getName' }; // Inicializa a sessão e define o primeiro passo
    }

    const userSession = this.sessions[userId];

    try {
      if (userSession.step === 'getName') {
        userSession.name = message.body;
        userSession.step = 'menu'; // Avança para o próximo passo
        return `Olá, ${userSession.name}! Como posso te ajudar? Digite:\n1️⃣ para Fazer Pedido\n2️⃣ para Ver Meus Pedidos\n3️⃣ para Cancelar Pedido\n0️⃣ para Sair`;
      }

      if (userSession.step === 'menu') {
        if (message.body === '1') {
          userSession.step = 'selectItem';
          return this._createMenuOptions();
        } else if (message.body === '2') {
          userSession.step = 'viewOrders';
          return this._viewOrders(userId);
        } else if (message.body === '3') {
          userSession.step = 'cancelOrder';
          return '⚠️ Nenhum pedido em andamento para cancelar.';
        } else if (message.body === '0') {
          delete this.sessions[userId];
          return '👋 Atendimento encerrado. Obrigado por usar nossos serviços!';
        } else {
          return '❌ Opção inválida. Por favor, digite 1, 2, 3 ou 0.';
        }
      } else if (userSession.step === 'selectItem') {
        const item = this._getMenuItem(message.body);
        if (item) {
          userSession.order = { item, quantity: 1 };
          userSession.step = 'getPaymentMethod';
          return `Você escolheu *${item}*.\nComo deseja pagar? Digite:\n1️⃣ para Cartão 💳\n2️⃣ para Dinheiro 💵\n0️⃣ para Sair`;
        } else if (message.body === '0') {
          delete this.sessions[userId];
          return '👋 Atendimento encerrado. Obrigado por usar nossos serviços!';
        }
        return `❌ Opção inválida. Por favor, selecione um item do cardápio.`;
      } else if (userSession.step === 'getPaymentMethod') {
        const paymentMethod = this._getPaymentMethod(message.body);
        if (paymentMethod) {
          userSession.paymentMethod = paymentMethod;
          userSession.step = 'getAddress';
          return '🏠 Por favor, envie o nome do seu endereço para entrega.\n0️⃣ para Sair';
        } else if (message.body === '0') {
          delete this.sessions[userId];
          return '👋 Atendimento encerrado. Obrigado por usar nossos serviços!';
        }
        return '❌ Forma de pagamento inválida. Por favor, escolha 1 para Cartão ou 2 para Dinheiro.';
      } else if (userSession.step === 'getAddress') {
        if (message.body === '0') {
          delete this.sessions[userId];
          return '👋 Atendimento encerrado. Obrigado por usar nossos serviços!';
        }

        // Registra o endereço fornecido pelo usuário
        userSession.location = message.body || 'Endereço não fornecido';

        // Gera o pedido e prossegue.
        const order = this.orderController.createOrder({
          item: userSession.order.item,
          quantity: userSession.order.quantity,
          user: userSession.name,
          location: userSession.location,
          paymentMethod: userSession.paymentMethod,
        });
        const orderNumber = this._generateOrderNumber();
        delete this.sessions[userId]; // Reseta a sessão após o pedido
        return `✅ Pedido criado com sucesso!\n📝 *Resumo:*\n🍔 Item: ${order.item}\n🔢 Quantidade: ${order.quantity}\n💳 Forma de Pagamento: ${order.paymentMethod}\n🏠 Endereço: ${order.location}\n📞 Número do Pedido: *${orderNumber}*\n🚚 Obrigado, ${order.user}! Seu pedido será entregue em breve.`;
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      return '❌ Houve um erro ao processar sua solicitação. Por favor, tente novamente.';
    }

    return '❌ Comando não reconhecido. Por favor, escolha uma opção do menu.';
  }

  _createMenuOptions() {
    return `🍽️ Escolha um item do cardápio:\n1️⃣ para Pizza 🍕\n2️⃣ para Hamburguer 🍔\n3️⃣ para Refrigerante 🥤\n0️⃣ para Sair`;
  }

  _getMenuItem(option) {
    const menu = {
      '1': 'Pizza',
      '2': 'Hamburguer',
      '3': 'Refrigerante',
    };
    return menu[option] || null;
  }

  _getPaymentMethod(option) {
    const methods = {
      '1': 'Cartão',
      '2': 'Dinheiro',
    };
    return methods[option] || null;
  }

  _viewOrders(userId) {
    const orders = this.orderController.getOrderByUser(userId); // Suponha que esse método exista no OrderController
    if (orders.length > 0) {
      let response = '📦 *Seus pedidos:*\n';
      orders.forEach((order) => {
        response += `\n🔹 Pedido ${order.id}: ${order.item} - ${order.quantity}x\n🗺️ Endereço: ${order.location}\n💳 Pagamento: ${order.paymentMethod}\n`;
      });
      return response + '\n0️⃣ para Sair';
    }
    return '📦 Você não tem pedidos no momento.\n0️⃣ para Sair';
  }

  _generateOrderNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Gera um número de 6 dígitos
  }
}

module.exports = MessageController;
