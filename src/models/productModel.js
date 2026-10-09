const products = [];

module.exports = {
  getAll: (query = {}) => {
    let result = [...products];
    if (query.search) {
      const term = query.search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term)));
    }
    if (query.category) {
      result = result.filter(p => p.category === query.category);
    }
    if (query.maxPrice) {
      result = result.filter(p => Number(p.price) <= Number(query.maxPrice));
    }
    return result;
  },
  create: (product) => {
    const newProduct = {
      id: Date.now().toString(),
      status: 'Disponible',
      createdAt: new Date(),
      ...product
    };
    products.push(newProduct);
    return newProduct;
  },
  findById: (id) => products.find(p => p.id === id),
  update: (id, data) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...data };
      return products[index];
    }
    return null;
  },
  delete: (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      return products.splice(index, 1)[0];
    }
    return null;
  },
  updateStatus: (id, status) => {
    const prod = products.find(p => p.id === id);
    if (prod) prod.status = status;
    return prod;
  }
};