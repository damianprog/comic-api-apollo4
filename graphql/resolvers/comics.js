import models from "../models/index.js";

const Book = models["Book"];

export default {
  Query: {
    async book(_, { id }) {
      const book = await Book.findOne({ where: { id } });
      return book;
    },
  },

  Mutation: {
    async createBook(_, args) {
      const book = await Book.create(args);
      return book;
    },
  },
};
