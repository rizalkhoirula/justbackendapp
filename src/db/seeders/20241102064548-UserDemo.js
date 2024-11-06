'use strict';

const bcryptjs = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcryptjs.genSalt(10);
    
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      email: 'admin@example.com',
      password: await bcryptjs.hash('password123', salt), // Enkripsi password sebelum memasukkan ke database
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      username: 'user1',
      email: 'user1@example.com',
      password: await bcryptjs.hash('password123', salt), // Enkripsi password sebelum memasukkan ke database
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
