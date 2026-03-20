"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reviews", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      book_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      typename: {
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

    await queryInterface.addConstraint("reviews", {
      fields: ["book_id"],
      type: "foreign key",
      name: "fk_reviews_book",
      references: {
        table: "books",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("reviews", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_reviews_user",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("reviews", ["book_id"], {
      name: "idx_reviews_book_id",
    });

    await queryInterface.addIndex("reviews", ["user_id"], {
      name: "idx_reviews_user_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("reviews");
  },
};
