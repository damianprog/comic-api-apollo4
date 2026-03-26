import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { validateCreateUserComicInput } from "../../utils/validators/user-mutations-validators.js";

import models from "../models/index.js";
const Book = models["Book"];
const UserBook = models["UserBook"];
const User = models["User"];

export default {
  Query: {
    async userBook(_, { id }) {
      const foundUserBook = await UserBook.findOne({
        where: { id },
        include: { all: true, nested: true },
      });

      return foundUserBook;
    },

    async userBooks(_, { userId, nickname, bookId }) {
      let foundUserId = userId;

      if (nickname) {
        const user = await User.findOne({ where: { nickname } });
        foundUserId = user ? user.id : null;
      }

      if (!foundUserId) {
        return [];
      }

      const where = { userId: foundUserId };

      if (bookId) {
        where.bookId = bookId;
      }

      const foundUserBooks = await UserBook.findAll({
        where,
        include: { all: true, nested: true },
        order: [["createdAt", "DESC"]],
      });

      return foundUserBooks;
    },

    async userBooksCategories(_, { userId, nickname }) {
      let foundUserId = userId;

      if (nickname) {
        const user = await User.findOne({ where: { nickname } });
        foundUserId = user ? user.id : null;
      }

      if (!foundUserId) {
        return [];
      }

      const userBooks = await UserBook.findAll({
        where: { userId: foundUserId },
        raw: true,
      });

      const allUserBooksCategories = userBooks.map(
        (userBook) => userBook.category,
      );
      const uniqueUserBooksCategories = [...new Set(allUserBooksCategories)];

      uniqueUserBooksCategories.sort();

      return uniqueUserBooksCategories;
    },
  },

  Mutation: {
    async createUserBook(_, { newBookInput, category }, { user }) {
      if (user) {
        const { valid, errors } = validateCreateUserComicInput({
          ...newBookInput,
          category,
        });

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        let book = null;

        if (newBookInput.id) {
          book = await Book.findOne({
            where: { id: newBookInput.id },
          });
        }

        if (!book && newBookInput.googleBooksId) {
          book = await Book.findOne({
            where: { googleBooksId: newBookInput.googleBooksId },
          });
        }

        if (!book) {
          book = await Book.create(newBookInput);
        }

        const alreadyCreatedUserBook = await UserBook.findOne({
          where: { bookId: book.id, userId: user.id, category },
        });

        if (alreadyCreatedUserBook) {
          const errors = { category: "Book is already in this category" };
          throw new UserInputError("Errors", errors);
        }

        let newUserBook = await UserBook.create({
          category,
          bookId: book.id,
          userId: user.id,
          typename: "UserBook",
        });

        newUserBook = await UserBook.findOne({
          where: { id: newUserBook.id },
          include: { all: true, nested: true },
        });

        return newUserBook;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },

    async updateUserBook(_, { userBookId, category }, { user }) {
      if (user) {
        const foundUserBook = await UserBook.findOne({
          where: { id: userBookId },
          include: { all: true, nested: true },
        });

        if (!foundUserBook) {
          throw new UserInputError("UserBook with provided id does not exist");
        }

        if (foundUserBook.userId !== user.id) {
          throw new UserInputError("Sorry, you're not the owner of this item!");
        }

        const updatedUserBook = await foundUserBook.update({
          category,
        });

        return updatedUserBook;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },

    async deleteUserBook(_, { userBookId }, { user }) {
      if (user) {
        const deletedUserBook = await UserBook.findOne({
          where: { id: userBookId },
          include: { all: true, nested: true },
        });

        if (!deletedUserBook) {
          throw new UserInputError("UserBook with provided id does not exist");
        }

        if (deletedUserBook.userId !== user.id) {
          throw new UserInputError("Sorry, you're not the owner of this item!");
        }

        await deletedUserBook.destroy();

        return "UserBook deleted successfully";
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
