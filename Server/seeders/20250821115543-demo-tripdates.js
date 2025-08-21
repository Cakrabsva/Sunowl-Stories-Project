'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('TripDates', [
      {
        id: 1,
        OpenTripId: 2,
        departure_date: new Date('2025-09-01'),
        return_date: new Date('2025-09-03'),
        quota: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        OpenTripId: 2,
        departure_date: new Date('2025-10-01'),
        return_date: new Date('2025-10-03'),
        quota: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        OpenTripId: 2,
        departure_date: new Date('2025-11-01'),
        return_date: new Date('2025-11-03'),
        quota: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('TripDates', null, {});
  }
};
