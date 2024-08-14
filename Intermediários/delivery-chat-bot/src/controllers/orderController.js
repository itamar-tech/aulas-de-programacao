const fs = require('fs');
const path = require('path');

class OrderController {
  constructor() {
    this.ordersFilePath = path.join(__dirname, '../../data/orders.json'); // Caminho corrigido
  }

  createOrder(orderDetails) {
    const orders = this._getAllOrders();
    const newOrder = { id: orders.length + 1, ...orderDetails };
    orders.push(newOrder);
    this._saveOrders(orders);
    return newOrder;
  }

  getOrderById(orderId) {
    const orders = this._getAllOrders();
    return orders.find(order => order.id === orderId) || null;
  }

  _getAllOrders() {
    try {
      if (!fs.existsSync(this.ordersFilePath)) {
        // Se o arquivo não existir, cria um arquivo vazio e retorna um array vazio
        this._saveOrders([]);
        return [];
      }
      const ordersData = fs.readFileSync(this.ordersFilePath, 'utf8');
      if (!ordersData) {
        // Se o arquivo estiver vazio, retorna um array vazio
        return [];
      }
      return JSON.parse(ordersData);
    } catch (error) {
      console.error('Erro ao ler o arquivo orders.json:', error);
      return []; // Retorna um array vazio em caso de erro
    }
  }

  _saveOrders(orders) {
    try {
      fs.writeFileSync(this.ordersFilePath, JSON.stringify(orders, null, 2));
    } catch (error) {
      console.error('Erro ao salvar o arquivo orders.json:', error);
    }
  }
}

module.exports = OrderController;
