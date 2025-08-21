'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('OpenTrips', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
    
    await queryInterface.addColumn('OpenTrips', 'TripCategoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'TripCategories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    });

    await queryInterface.addColumn('OpenTrips', 'min_slots', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn('OpenTrips', 'max_slots', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('OpenTrips', 'is_active');
    await queryInterface.removeColumn('OpenTrips', 'min_slots');
    await queryInterface.removeColumn('OpenTrips', 'max_slots');
    await queryInterface.removeColumn('OpenTrips', 'TripCategoryId');
  }
};
