"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class UserBook extends Model {
    static associate({ User, Book, Comment }) {
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
      this.belongsTo(Book, { foreignKey: "bookId", as: "book" });
      this.hasMany(Comment, { foreignKey: "userBookId", as: "comments" });
    }
  }

  UserBook.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },
      bookId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "book_id",
      },
      typename: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "user_books",
      modelName: "UserBook",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return UserBook;
};
