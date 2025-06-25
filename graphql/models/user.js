"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ UserDetails, UserComic, Review }) {
      this.hasOne(UserDetails, { foreignKey: "userId", as: "userDetails" });
      this.hasMany(UserComic, { foreignKey: "userId", as: "userComics" });
      this.hasMany(Review, { foreignKey: "comicId", as: "reviews" });
    }
  }
  User.init(
    {
      nickname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      birthDate: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
