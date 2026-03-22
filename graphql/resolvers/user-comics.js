import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { validateCreateUserComicInput } from "../../utils/validators/user-mutations-validators.js";

import models from "../models/index.js";
const Book = models["Book"];
const UserBook = models["UserBook"];
const User = models["User"];

export default {
  Query: {
    async userBooks(_, { userId, nickname, bookId }) {
      let userBooks = [];
      let foundUserId = userId;

      if (nickname) {
        const user = await User.findOne({ where: { nickname } });
        foundUserId = user ? user.id : foundUserId;
      }

      if (foundUserId && bookId) {
        userBooks = await UserBook.findAll({
          where: { userId: foundUserId, bookId },
          include: ["book", "user"],
        });
      } else if (foundUserId) {
        userBooks = await UserBook.findAll({
          where: { userId: foundUserId },
          include: ["book", "user"],
        });
      }

      return userBooks;
    },

    async userBooksCategories(_, { userId, nickname }) {
      let foundUserId = userId;

      if (nickname) {
        const user = await User.findOne({ where: { nickname } });
        foundUserId = user ? user.id : foundUserId;
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

        const alreadyCreatedUserBook = await UserBook.findOne({
          where: { bookId: newBookInput.id, userId: user.id, category },
        });

        if (alreadyCreatedUserBook) {
          const errors = { category: "Book is already in this category" };
          throw new UserInputError("Errors", errors);
        }

        const { id } = newBookInput;
        let book = await Book.findOne({ where: { id } });

        if (!book) {
          book = await Book.create(newBookInput);
        }

        let newUserBook = await UserBook.create({
          category,
          bookId: book.id,
          userId: user.id,
          typename: "UserBook",
        });

        newUserBook = await UserBook.findOne({
          where: { id: newUserBook.id },
          include: ["book", "user"],
        });

        return newUserBook;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },

    async deleteUserBook(_, { id }, { user }) {
      if (user) {
        const deletedUserBook = await UserBook.findOne({
          where: { id },
          include: ["user", "book"],
        });

        if (!deletedUserBook) {
          throw new UserInputError("UserBook with provided id does not exist");
        }

        if (deletedUserBook.user.id !== user.id) {
          throw new UserInputError("Sorry, you're not the owner of this item!");
        }

        await deletedUserBook.destroy();

        return deletedUserBook;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
