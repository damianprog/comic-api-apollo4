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

    async searchBooks(_, { query }) {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        throw new UserInputError("Query must not be empty");
      }

      const foundBooks = await Book.findAll({
        where: {
          title: {
            [Op.iLike]: `%${normalizedQuery}%`,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      return foundBooks;
    },
  },

  Mutation: {
    async createBook(_, { newBookInput }) {
      const existingBook = await Book.findOne({
        where: { googleBooksId: newBookInput.googleBooksId },
      });

      if (existingBook) {
        throw new UserInputError(
          "Book with provided googleBooksId already exists",
        );
      }

      const createdBook = await Book.create(newBookInput);

      return createdBook;
    },

    async updateBook(_, { bookId, updateBookInput }) {
      const foundBook = await Book.findOne({
        where: { id: bookId },
      });

      if (!foundBook) {
        throw new UserInputError("Book with provided id does not exist");
      }

      const updatedBook = await foundBook.update(updateBookInput);

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
