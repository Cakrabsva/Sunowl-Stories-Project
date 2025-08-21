'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TripCategories',
      [{
        "id": 1,
        "OpenTripId": 2,
        "category_name": "Montain",
        "createdAt":new Date (),
        "updatedAt":new Date ()
      }, {
        "id": 2,
        "OpenTripId": 3,
        "category_name": "Island",
        "createdAt":new Date (),
        "updatedAt":new Date ()
      }, {
        "id": 3,
        "OpenTripId": 4,
        "category_name": "Camping",
        "createdAt":new Date (),
        "updatedAt": new Date ()
      }, {
        "id": 4,
        "OpenTripId": 5,
        "category_name": "Museum",
        "createdAt":new Date (),
        "updatedAt":new Date ()
    }], {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('TripCategories', null, {})
  }
};
