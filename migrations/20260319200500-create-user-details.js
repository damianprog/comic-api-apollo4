"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_details", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },

      profile_image: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },

      background_image: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },

      profile_image_public_id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },

      background_image_public_id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },

      about: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },

      interests: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
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

    await queryInterface.addConstraint("user_details", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_user_details_user",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addIndex("user_details", ["user_id"], {
      name: "idx_user_details_user_id",
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_details");
  },
};
