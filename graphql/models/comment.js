"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ UserComic, Review, User }) {
      this.belongsTo(UserComic, { foreignKey: "userComicId", as: "userComic" });
      this.belongsTo(Review, { foreignKey: "reviewId", as: "review" });
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
  }
  Comment.init(
    {
      text: DataTypes.STRING,
      userComicId: DataTypes.INTEGER,
      reviewId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      underscored: true,
      tableName: "comments",
      modelName: "Comment",
    }
  );
  return Comment;
};
