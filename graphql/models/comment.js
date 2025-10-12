"use strict";
import { INTEGER, Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ Review, User, UserComic, Comic }) {
      this.belongsTo(Review, { foreignKey: "reviewId", as: "review" });
      this.belongsTo(UserComic, { foreignKey: "userComicId", as: "userComic" });
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
  }
  Comment.init(
    {
      text: DataTypes.STRING,
      reviewId: DataTypes.INTEGER,
      userComicId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      typename: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "comments",
      modelName: "Comment",
    }
  );
  return Comment;
};
