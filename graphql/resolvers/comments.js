import { AuthenticationError } from "apollo-server-errors";
import { Op } from "sequelize";
import { validateCommentInput } from "../../utils/validators/comment-mutations-validators.js";

import models from "../models/index.js";
const Comment = models["Comment"];

export default {
  Query: {
    async comment(_, { id }) {
      const foundComment = await Comment.findOne({
        where: { id },
        include: { all: true, nested: true },
      });

      return foundComment;
    },
    async comments(_, { userComicId, reviewId }) {
      const foundComments = await Comment.findAll({
        where: {
          [Op.or]: [
            {
              userComicId: userComicId ? userComicId : 0,
            },
            {
              reviewId: reviewId ? reviewId : 0,
            },
          ],
        },
        include: { all: true, nested: true },
      });

      return foundComments;
    },
  },
  Mutation: {
    async createComment(_, { userComicId, reviewId, text }, { user }) {
      if (user) {
        const { errors, valid } = validateCommentInput({ text });

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        let comment = await Comment.create({
          text,
          userComicId,
          reviewId,
        });

        comment = await Comment.findOne({
          where: { id: comment.id },
          include: { all: true, nested: true },
        });

        return comment;
      }
      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
