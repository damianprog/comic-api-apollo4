"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";

const basename = path.basename(new URL(import.meta.url).pathname);
const env = process.env.NODE_ENV || "development";
const config = (
  await import("../../config/config.json", {
    assert: { type: "json" },
  })
).default[env];

const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

import User from "./user.js";
import UserDetails from "./user-details.js";
import Book from "./book.js";
import UserBook from "./user-book.js";
import Review from "./review.js";
import Comment from "./comment.js";

db.User = User(sequelize, DataTypes);
db.UserDetails = UserDetails(sequelize, DataTypes);
db.Book = Book(sequelize, DataTypes);
db.UserBook = UserBook(sequelize, DataTypes);
db.Review = Review(sequelize, DataTypes);
db.Comment = Comment(sequelize, DataTypes);

Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
