const fs = require('fs');
const path = require('path');
const OrderController = require('../src/controllers/orderController');

jest.mock('fs');

describe('OrderController', () => {
  let orderController;
  const mockOrders = [
    { id: 1, item: 'Pizza', quantity: 1, user: 'Teste', location: 'Minha localização', paymentMethod: 'Cartão' },
    { id: 2, item: 'Hamburguer', quantity: 2, user: 'Outro', location: 'Outro local', paymentMethod: 'Dinheiro' }
  ];

  beforeEach(() => {
    orderController = new OrderController();
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockOrders));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Deve criar um novo pedido e salvar no arquivo', () => {
    const newOrderDetails = {
      item: 'Refrigerante',
      quantity: 3,
      user: 'Novo Usuário',
      location: 'Novo local',
      paymentMethod: 'Cartão'
    };

    const newOrder = orderController.createOrder(newOrderDetails);

    expect(newOrder).toEqual({
      id: mockOrders.length + 1,
      ...newOrderDetails
    });

    const expectedFilePath = path.join(__dirname, '../data/orders.json'); // Caminho relativo a partir do diretório de testes
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedFilePath,
      JSON.stringify([...mockOrders, newOrder], null, 2)
    );
  });

  test('Deve salvar os pedidos no arquivo', () => {
    orderController._saveOrders(mockOrders);
    const expectedFilePath = path.join(__dirname, '../data/orders.json'); // Caminho relativo a partir do diretório de testes
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedFilePath,
      JSON.stringify(mockOrders, null, 2)
    );
  });
});
