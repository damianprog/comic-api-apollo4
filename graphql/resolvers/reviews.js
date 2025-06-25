import { UserInputError, AuthenticationError } from "apollo-server-errors";
import { Op } from "sequelize";
import { validateReviewInput } from "../../utils/validators/review-mutations-validators.js";

import models from "../models/index.js";
const Comic = models["Comic"];
const Review = models["Review"];

export default {
  Query: {
    async review(_, { id }) {
      const foundReview = await Review.findOne({
        where: { id },
        include: { all: true, nested: true },
      });

      return foundReview;
    },
    async reviews(_, { userId, comicId }) {
      const foundReviews = await Review.findAll({
        where: {
          [Op.or]: [
            {
              comicId: comicId ? comicId : 0,
            },
            {
              userId: userId ? userId : 0,
            },
          ],
        },
        include: { all: true, nested: true },
      });

      return foundReviews;
    },
  },
  Mutation: {
    async createReview(_, { newComicInput, text }, { user }) {
      if (user) {
        const { errors, valid } = validateReviewInput({ text });

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        const alreadyCreatedReview = await Review.findOne({
          where: { comicId: newComicInput.id, userId: user.id },
        });

        if (alreadyCreatedReview)
          throw new UserInputError("Provided Review already exists");

        const { id } = newComicInput;
        let comic = await Comic.findOne({ where: { id } });
        if (!comic) {
          comic = await Comic.create(newComicInput);
        }

        let review = await Review.create({
          text,
          comicId: comic.id,
          userId: user.id,
        });

        review = await Review.findOne({
          where: { id: review.dataValues.id },
          include: ["comic", "user"],
        });

        return review;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
    async updateReview(_, { comicId, text }, { user }) {
      if (user) {
        const { errors, valid } = validateReviewInput({ text });

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        const review = await Review.findOne({
          where: { comicId, userId: user.id },
          include: ["comic", "user"],
        });
        review.text = text;
        await review.save();

        return review;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
    async deleteReview(_, { id }, { user }) {
      if (user) {
        const deletedReview = await Review.findOne({
          where: { id },
          include: ["user", "comic"],
        });

        if (!deletedReview) {
          throw new UserInputError("Review with provided id does not exist");
        }

        if (deletedReview.user.id !== user.id) {
          throw new UserInputError("Sorry, you're not the owner of this item!");
        }

        deletedReview.destroy();

        return deletedReview;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
