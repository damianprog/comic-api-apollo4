"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Comic extends Model {
    static associate({ UserComic, Review }) {
      this.hasMany(UserComic, { foreignKey: "comicId", as: "userComics" });
      this.hasMany(Review, { foreignKey: "comicId", as: "reviews" });
    }
  }
  Comic.init(
    {
      title: DataTypes.STRING,
      coverImage: DataTypes.TEXT,
      onsaleDate: DataTypes.DATE,
      writer: DataTypes.STRING,
      inker: DataTypes.STRING,
      penciler: DataTypes.STRING,
      description: DataTypes.TEXT,
      seriesId: DataTypes.INTEGER,
      linkingUrl: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "comics",
      modelName: "Comic",
    }
  );
  return Comic;
};
