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
    await queryInterface.bulkInsert('OpenTrips', [
      {
        title: 'Explore Bali',
        description: 'Menikmati keindahan pantai dan budaya Bali dalam 3 hari 2 malam.',
        location: 'Bali',
        price: 2500000,
        duration_days: 3,
        duration_nights: 2,
        rating: 4.8,
        image_url: 'https://example.com/bali.jpg',
        available_slots: 15,
        departure_date: new Date('2025-08-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Adventure Lombok',
        description: 'Pendakian Rinjani dan snorkeling di Gili Trawangan.',
        location: 'Lombok',
        price: 3000000,
        duration_days: 4,
        duration_nights: 3,
        rating: 4.7,
        image_url: 'https://example.com/lombok.jpg',
        available_slots: 10,
        departure_date: new Date('2025-08-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Labuan Bajo Escape',
        description: 'Sailing Komodo, Pulau Padar, dan Pink Beach.',
        location: 'Labuan Bajo',
        price: 3500000,
        duration_days: 3,
        duration_nights: 2,
        rating: 4.9,
        image_url: 'https://example.com/labuan.jpg',
        available_slots: 12,
        departure_date: new Date('2025-09-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Discover Yogyakarta',
        description: 'Trip budaya dan alam: Borobudur, Merapi, Goa Pindul.',
        location: 'Yogyakarta',
        price: 1500000,
        duration_days: 2,
        duration_nights: 1,
        rating: 4.5,
        image_url: 'https://example.com/jogja.jpg',
        available_slots: 20,
        departure_date: new Date('2025-08-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Hidden Gems Sumatera Barat',
        description: 'Trip ke Lembah Harau, Bukittinggi, dan Kelok 9.',
        location: 'Sumatera Barat',
        price: 1800000,
        duration_days: 3,
        duration_nights: 2,
        rating: 4.6,
        image_url: 'https://example.com/sumbar.jpg',
        available_slots: 8,
        departure_date: new Date('2025-08-25'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('open_trips', null, {});
  }
};
