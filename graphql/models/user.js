"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ UserDetails, UserBook, Review }) {
      this.hasOne(UserDetails, { foreignKey: "userId", as: "userDetails" });
      this.hasMany(UserBook, { foreignKey: "userId", as: "userBooks" });
      this.hasMany(Review, { foreignKey: "userId", as: "reviews" });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATE,
        field: "birth_date",
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return User;
};
