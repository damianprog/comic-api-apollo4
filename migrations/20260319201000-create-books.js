"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("books", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      google_books_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },

      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      authors: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: [],
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      thumbnail: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      published_date: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      publisher: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      page_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      categories: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: [],
      },

      language: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("books", ["google_books_id"], {
      name: "idx_books_google_books_id",
      unique: true,
    });

    await queryInterface.addIndex("books", ["title"], {
      name: "idx_books_title",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("books");
  },
};
