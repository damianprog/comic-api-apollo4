import { UserInputError, AuthenticationError } from "apollo-server-errors";
import { Op } from "sequelize";
import { validateReviewInput } from "../../utils/validators/review-mutations-validators.js";

import models from "../models/index.js";
const Book = models["Book"];
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

    async reviews(_, { userId, bookId }) {
      const foundReviews = await Review.findAll({
        where: {
          [Op.or]: [
            {
              bookId: bookId ? bookId : null,
            },
            {
              userId: userId ? userId : null,
            },
          ],
        },
        include: { all: true, nested: true },
      });

      return foundReviews;
    },
  },

  Mutation: {
    async createReview(_, { newBookInput, text }, { user }) {
      if (user) {
        const { errors, valid } = validateReviewInput({ text });

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        const alreadyCreatedReview = await Review.findOne({
          where: { bookId: newBookInput.id, userId: user.id },
        });

        if (alreadyCreatedReview) {
          throw new UserInputError("Provided Review already exists");
        }

        const { id } = newBookInput;
        let book = await Book.findOne({ where: { id } });

        if (!book) {
          book = await Book.create(newBookInput);
        }

        let review = await Review.create({
          text,
          bookId: book.id,
          userId: user.id,
          typename: "Review",
        });

        review = await Review.findOne({
          where: { id: review.dataValues.id },
          include: ["book", "user"],
        });

        return review;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },

    async updateReview(_, { bookId, text }, { user }) {
      if (user) {
        const { errors, valid } = validateReviewInput({ text });

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        const review = await Review.findOne({
          where: { bookId, userId: user.id },
          include: ["book", "user"],
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
          include: ["user", "book"],
        });

        if (!deletedReview) {
          throw new UserInputError("Review with provided id does not exist");
        }

        if (deletedReview.user.id !== user.id) {
          throw new UserInputError("Sorry, you're not the owner of this item!");
        }

        await deletedReview.destroy();

        return deletedReview;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
