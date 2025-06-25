"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Review extends Model {
    static associate({ Comic, User, Comment }) {
      this.belongsTo(Comic, { foreignKey: "comicId", as: "comic" });
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
      this.hasMany(Comment, { foreignKey: "reviewId", as: "comments" });
    }
  }
  Review.init(
    {
      comicId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      text: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "reviews",
      modelName: "Review",
    }
  );
  return Review;
};
