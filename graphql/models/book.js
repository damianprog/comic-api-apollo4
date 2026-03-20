"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Book extends Model {
    static associate({ UserBook, Review }) {
      this.hasMany(UserBook, { foreignKey: "bookId", as: "userBooks" });
      this.hasMany(Review, { foreignKey: "bookId", as: "reviews" });
    }

    static fromGoogle(apiData) {
      const info = apiData.volumeInfo;

      return {
        googleBooksId: apiData.id,
        title: info.title || null,
        authors: info.authors || [],
        description: info.description || null,
        thumbnail: info.imageLinks?.thumbnail || null,
        publishedDate: info.publishedDate || null,
        publisher: info.publisher || null,
        pageCount: info.pageCount || null,
        categories: info.categories || [],
        language: info.language || null,
      };
    }
  }

  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      googleBooksId: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: "google_books_id",
      },
      title: {
        type: DataTypes.TEXT,
      },
      authors: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      description: {
        type: DataTypes.TEXT,
      },
      thumbnail: {
        type: DataTypes.TEXT,
      },
      publishedDate: {
        type: DataTypes.TEXT,
        field: "published_date",
      },
      publisher: {
        type: DataTypes.TEXT,
      },
      pageCount: {
        type: DataTypes.INTEGER,
        field: "page_count",
      },
      categories: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      language: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "books",
      modelName: "Book",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return Book;
};
