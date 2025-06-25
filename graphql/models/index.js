import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
// const env = process.env.NODE_ENV || 'development';
import { devConfig, prodConfig } from "../../db-config/db-config.js";
import comicModel from "./comic.js";
import commentModel from "./comment.js";
import reviewModel from "./review.js";
import userComicModel from "./user-comic.js";
import userDetailsModel from "./user-details.js";
import userModel from "./user.js";

const models = [
  comicModel,
  commentModel,
  reviewModel,
  userComicModel,
  userDetailsModel,
  userModel,
];

// let sslConfig = { dialect: 'postgres' };

// if (env === 'production') {
//   sslConfig = {
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//   };
// }

const config = devConfig;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// const sequelize = new Sequelize(config, sslConfig)

const db = {};

models.forEach((model) => {
  const connectedModel = model(sequelize, Sequelize.DataTypes);
  db[connectedModel.name] = connectedModel;
});

Object.values(db).forEach((connectedModel) => {
  if (connectedModel.associate) {
    connectedModel.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
