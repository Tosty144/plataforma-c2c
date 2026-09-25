// Simulación de Base de Datos en memoria (Reemplazar por Mongoose / Prisma)
const users = [];

module.exports = {
  findByEmail: (email) => users.find(u => u.email === email),
  create: (userData) => {
    users.push(userData);
    return userData;
  }
};