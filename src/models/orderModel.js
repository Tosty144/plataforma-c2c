const orders = [];

module.exports = {
  create: (orderData) => {
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date()
    };
    orders.push(newOrder);
    return newOrder;
  },
  getAll: () => orders,
  findById: (id) => orders.find(o => o.id === id)
};