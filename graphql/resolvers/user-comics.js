import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { validateCreateUserComicInput } from "../../utils/validators/user-mutations-validators.js";

import models from "../models/index.js";
const Comic = models["Comic"];
const UserComic = models["UserComic"];
const User = models["User"];

export default {
  Query: {
    async userComics(_, { userId, nickname, comicId }) {
      let userComics = [];
      let foundUserId = userId;

      if (nickname) {
        const user = await User.findOne({ where: { nickname } });
        foundUserId = user ? user.id : foundUserId;
      }

      if (foundUserId && comicId) {
        userComics = await UserComic.findAll({
          where: { userId: foundUserId, comicId },
          include: ["comic", "user"],
        });
      } else if (foundUserId) {
        userComics = await UserComic.findAll({
          where: { userId: foundUserId },
          include: ["comic", "user"],
        });
      }

      return userComics;
    },
    async userComicsCategories(_, { userId, nickname }) {
      let foundUserId = userId;

      if (nickname) {
        const user = await User.findOne({ where: { nickname } });
        foundUserId = user ? user.id : foundUserId;
      }

      const userComics = await UserComic.findAll({
        where: { userId: foundUserId },
        raw: true,
      });

      const allUserComicsCategories = userComics.map(
        (userComic) => userComic.category
      );
      const uniqueUserComicsCategories = [...new Set(allUserComicsCategories)];

      uniqueUserComicsCategories.sort();

      return uniqueUserComicsCategories;
    },
  },

  Mutation: {
    async createUserComic(_, { newComicInput, category }, { user }) {
      if (user) {
        const { valid, errors } = validateCreateUserComicInput({
          ...newComicInput,
          category,
        });

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        const alreadyCreatedUserComic = await UserComic.findOne({
          where: { comicId: newComicInput.id, userId: user.id, category },
        });

        if (alreadyCreatedUserComic) {
          const errors = { category: "Comic is already in this category" };
          throw new UserInputError("Errors", errors);
        }

        const { id } = newComicInput;
        let comic = await Comic.findOne({ where: { id } });
        if (!comic) {
          comic = await Comic.create(newComicInput);
        }

        let newUserComic = await UserComic.create({
          category,
          comicId: comic.id,
          userId: user.id,
          typename: "UserComic",
        });

        // Finding just created userComic to get associated objects
        newUserComic = await UserComic.findOne({
          where: { id: newUserComic.id },
          include: ["comic", "user"],
        });

        return newUserComic;
      }
      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
    async deleteUserComic(_, { id }, { user }) {
      if (user) {
        const deletedUserComic = await UserComic.findOne({
          where: { id },
          include: ["user", "comic"],
        });

        if (!deletedUserComic) {
          throw new UserInputError("UserComic with provided id does not exist");
        }

        if (deletedUserComic.user.id !== user.id) {
          throw new UserInputError("Sorry, you're not the owner of this item!");
        }

        deletedUserComic.destroy();

        return deletedUserComic;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
