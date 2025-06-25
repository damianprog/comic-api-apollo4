"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class UserComic extends Model {
    static associate({ Comic, User, Comment }) {
      this.belongsTo(Comic, { foreignKey: "comicId", as: "comic" });
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
      // this.hasMany(Comment, { foreignKey: "userComicId", as: "comments" });
    }
  }
  UserComic.init(
    {
      category: DataTypes.STRING,
      comicId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "usersComics",
      modelName: "UserComic",
    }
  );
  return UserComic;
};
