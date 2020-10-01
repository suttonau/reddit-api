'use strict';
const faker = require('faker');

const posts = [...Array(100)].map((post) => ({
  title: faker.company.catchPhrase(),
  link: faker.internet.url(),
  imageUrl: 'https://picsum.photos/600/600',
  createdAt: new Date(),
  updatedAt: new Date()
}));


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Posts', posts);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
