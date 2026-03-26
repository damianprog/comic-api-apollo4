import { Op } from "sequelize";
import { UserInputError } from "apollo-server-errors";
import models from "../models/index.js";

const Book = models["Book"];

export default {
  Query: {
    async book(_, { id }) {
      const foundBook = await Book.findOne({
        where: { id },
      });

      return foundBook;
    },

    async books() {
      const foundBooks = await Book.findAll({
        order: [["createdAt", "DESC"]],
      });

      return foundBooks;
    },

    async searchBooks(_, { title }) {
      const foundBooks = await Book.findAll({
        where: {
          title: {
            [Op.iLike]: `%${title}%`,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      return foundBooks;
    },
  },

  Mutation: {
    async createBook(_, args) {
      const createdBook = await Book.create(args);

      return createdBook;
    },

    async updateBook(_, { bookId, ...args }) {
      const foundBook = await Book.findOne({
        where: { id: bookId },
      });

      if (!foundBook) {
        throw new UserInputError("Book with provided id does not exist");
      }

      const updatedBook = await foundBook.update(args);

      return updatedBook;
    },

    async deleteBook(_, { bookId }) {
      const foundBook = await Book.findOne({
        where: { id: bookId },
      });

      if (!foundBook) {
        throw new UserInputError("Book with provided id does not exist");
      }

      await foundBook.destroy();

      return "Book deleted successfully";
    },
  },
};
