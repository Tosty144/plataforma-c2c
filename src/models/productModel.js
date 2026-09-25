const products = [];

module.exports = {
  getAll: (query) => {
    let result = [...products];
    if (query.category) result = result.filter(p => p.category === query.category);
    if (query.search) result = result.filter(p => p.title.toLowerCase().includes(query.search.toLowerCase()));
    return result;
  },
  create: (product) => {
    products.push(product);
    return product;
  },
  findById: (id) => products.find(p => p.id === id),
  updateStatus: (id, status) => {
    const prod = products.find(p => p.id === id);
    if (prod) prod.status = status;
    return prod;
  }
};