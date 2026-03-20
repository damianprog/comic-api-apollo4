"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ Review, User, UserBook }) {
      this.belongsTo(Review, { foreignKey: "reviewId", as: "review" });
      this.belongsTo(UserBook, { foreignKey: "userBookId", as: "userBook" });
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      text: {
        type: DataTypes.TEXT,
      },

      reviewId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "review_id",
      },

      userBookId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "user_book_id",
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },

      typename: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "comments",
      modelName: "Comment",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return Comment;
};
