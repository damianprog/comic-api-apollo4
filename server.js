import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ruruHTML } from "ruru/server";
import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers/index.js";
// import jwt from "express-jwt";
import jwt from "jsonwebtoken";
import JWT_SECRET from "./config.js";
import cors from "cors";

import express from "express";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  "/graphql",
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      const user = verifyToken(token);
      return { user };
    },
  })
);
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});
app.listen(4000);
