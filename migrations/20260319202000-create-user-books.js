"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_books", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      book_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      typename: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      category: {
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

    await queryInterface.addConstraint("user_books", {
      fields: ["user_id", "book_id"],
      type: "unique",
      name: "unique_user_book",
    });

    await queryInterface.addConstraint("user_books", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_user_books_user",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("user_books", {
      fields: ["book_id"],
      type: "foreign key",
      name: "fk_user_books_book",
      references: {
        table: "books",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("user_books", ["user_id"], {
      name: "idx_user_books_user_id",
    });

    await queryInterface.addIndex("user_books", ["book_id"], {
      name: "idx_user_books_book_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_books");
  },
};
