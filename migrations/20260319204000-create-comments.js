"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      review_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      user_book_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
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

    await queryInterface.addConstraint("comments", {
      fields: ["review_id"],
      type: "foreign key",
      name: "fk_comments_review",
      references: {
        table: "reviews",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("comments", {
      fields: ["user_book_id"],
      type: "foreign key",
      name: "fk_comments_user_book",
      references: {
        table: "user_books",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("comments", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_comments_user",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("comments", ["review_id"], {
      name: "idx_comments_review_id",
    });

    await queryInterface.addIndex("comments", ["user_book_id"], {
      name: "idx_comments_user_book_id",
    });

    await queryInterface.addIndex("comments", ["user_id"], {
      name: "idx_comments_user_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("comments");
  },
};
