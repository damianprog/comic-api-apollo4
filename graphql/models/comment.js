"use strict";
import { INTEGER, Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ Review, User, Comic }) {
      this.belongsTo(Review, { foreignKey: "reviewId", as: "review" });
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
  }
  Comment.init(
    {
      text: DataTypes.STRING,
      reviewId: DataTypes.INTEGER,
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
