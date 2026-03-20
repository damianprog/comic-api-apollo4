"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class UserDetails extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
  }

  UserDetails.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      profileImage: {
        type: DataTypes.STRING,
        defaultValue: "",
        field: "profile_image",
      },

      backgroundImage: {
        type: DataTypes.STRING,
        defaultValue: "",
        field: "background_image",
      },

      profileImagePublicId: {
        type: DataTypes.STRING,
        defaultValue: "",
        field: "profile_image_public_id",
      },

      backgroundImagePublicId: {
        type: DataTypes.STRING,
        defaultValue: "",
        field: "background_image_public_id",
      },

      about: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      interests: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: "user_id",
      },
    },
    {
      sequelize,
      tableName: "user_details",
      modelName: "UserDetails",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return UserDetails;
};
