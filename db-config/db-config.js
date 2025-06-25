import dotenv from "dotenv";
dotenv.config();

// const devConfig = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

export const devConfig = {
  // user: process.env.DB_USER,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  dialect: "postgres",
};

export const prodConfig = process.env.DATABASE_URL;
