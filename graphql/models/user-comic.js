"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class UserComic extends Model {
    static associate({ Book, User, Comment }) {
      this.belongsTo(Book, { foreignKey: "bookId", as: "book" });
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
      this.hasMany(Comment, { foreignKey: "userComicId", as: "comments" });
    }
  }
  UserComic.init(
    {
      category: DataTypes.STRING,
      bookId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      typename: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "usersComics",
      modelName: "UserComic",
    },
  );
  return UserComic;
};
