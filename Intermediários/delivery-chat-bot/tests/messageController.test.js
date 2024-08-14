const MessageController = require('../src/controllers/messageController');
const OrderController = require('../src/controllers/orderController');

jest.mock('../src/controllers/orderController'); // Mock do OrderController

describe('MessageController', () => {
  let messageController;
  let mockOrderController;

  beforeEach(() => {
    // Criamos um mock do OrderController
    mockOrderController = new OrderController();
    // Criamos uma instância do MessageController
    messageController = new MessageController();
    messageController.orderController = mockOrderController; // Garantir que o MessageController usa o mock
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  test('Deve iniciar a sessão e solicitar o nome do usuário', () => {
    const message = { from: 'user1', body: 'Olá' };
    const response = messageController.handleIncomingMessage(message);

    expect(response).toBe('Olá, Olá! Como posso te ajudar?\n1. Fazer Pedido\n2. Ver Meus Pedidos\n3. Cancelar Pedido');
    expect(messageController.sessions['user1']).toBeDefined();
    expect(messageController.sessions['user1'].step).toBe('menu');
  });

  test('Deve avançar para o passo de localização após a escolha de "Fazer Pedido"', () => {
    const message = { from: 'user1', body: 'Fazer Pedido' };
    messageController.sessions['user1'] = { step: 'menu', name: 'Teste' };
    const response = messageController.handleIncomingMessage(message);

    expect(response).toBe('Por favor, envie sua localização.');
    expect(messageController.sessions['user1'].step).toBe('getLocation');
  });

  test('Deve solicitar a seleção de item após receber a localização', () => {
    const message = { from: 'user1', body: 'Minha localização' };
    messageController.sessions['user1'] = { step: 'getLocation', name: 'Teste' };
    const response = messageController.handleIncomingMessage(message);

    expect(response).toBe('Localização recebida. Aqui está nosso cardápio:\n1. Pizza\n2. Hamburguer\n3. Refrigerante\nPor favor, selecione um item.');
    expect(messageController.sessions['user1'].step).toBe('selectItem');
  });

  test('Deve solicitar a forma de pagamento após a seleção do item', () => {
    const message = { from: 'user1', body: '1' };
    messageController.sessions['user1'] = { step: 'selectItem', name: 'Teste', location: 'Minha localização' };
    const response = messageController.handleIncomingMessage(message);

    expect(response).toBe('Você escolheu Pizza. Agora, por favor, escolha a forma de pagamento:\n1. Cartão\n2. Dinheiro');
    expect(messageController.sessions['user1'].order.item).toBe('Pizza');
    expect(messageController.sessions['user1'].step).toBe('getPaymentMethod');
  });

  test('Deve criar o pedido e resetar a sessão após escolher a forma de pagamento', () => {
    const message = { from: 'user1', body: '1' };

    // Configurando o mock do OrderController para retornar um pedido válido
    const orderMock = {
      item: 'Pizza',
      quantity: 1,
      user: 'Teste',
      location: 'Minha localização',
      paymentMethod: 'Cartão',
    };
    mockOrderController.createOrder.mockReturnValue(orderMock);

    // Configurando a sessão do usuário
    messageController.sessions['user1'] = {
      step: 'getPaymentMethod',
      name: 'Teste',
      location: 'Minha localização',
      order: { item: 'Pizza', quantity: 1 },
    };

    const response = messageController.handleIncomingMessage(message);

    // Verificações
    expect(response).toBe('Pedido criado com sucesso!\nResumo:\nItem: Pizza\nQuantidade: 1\nForma de Pagamento: Cartão\nObrigado, Teste! Seu pedido será entregue em breve.');
    expect(messageController.sessions['user1']).toBeUndefined();
    expect(mockOrderController.createOrder).toHaveBeenCalledWith({
      item: 'Pizza',
      quantity: 1,
      user: 'Teste',
      location: 'Minha localização',
      paymentMethod: 'Cartão',
    });
  });

  test('Deve retornar mensagem de erro para opção de menu inválida', () => {
    const message = { from: 'user1', body: 'Opção inválida' };
    messageController.sessions['user1'] = { step: 'menu', name: 'Teste' };
    const response = messageController.handleIncomingMessage(message);

    expect(response).toBe('Comando não reconhecido. Por favor, escolha uma opção do menu: \nMenu:\n1. Fazer Pedido\n2. Ver Meus Pedidos\n3. Cancelar Pedido\nDigite a opção desejada.');
  });

  test('Deve retornar mensagem de erro para item de menu inválido', () => {
    const message = { from: 'user1', body: '4' };
    messageController.sessions['user1'] = { step: 'selectItem', name: 'Teste', location: 'Minha localização' };
    const response = messageController.handleIncomingMessage(message);

    expect(response).toBe('Opção inválida. Por favor, selecione um item do cardápio.');
  });

  test('Deve retornar mensagem de erro para forma de pagamento inválida', () => {
    const message = { from: 'user1', body: '3' };
    messageController.sessions['user1'] = {
      step: 'getPaymentMethod',
      name: 'Teste',
      location: 'Minha localização',
      order: { item: 'Pizza', quantity: 1 },
    };
    const response = messageController.handleIncomingMessage(message);

    expect(response).toBe('Forma de pagamento inválida. Por favor, escolha 1 para Cartão ou 2 para Dinheiro.');
  });
});
