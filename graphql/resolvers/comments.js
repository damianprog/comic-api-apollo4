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
        order: [["createdAt", "DESC"]],
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
          userId: user.id,
          reviewId,
          typename: "Comment",
        });

        comment = await Comment.findOne({
          where: { id: comment.id },
          include: { all: true, nested: true },
        });

        return comment;
      }
      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },

    async updateComment(_, { commentId, text }, { user }) {
      if (user) {
        const { errors, valid } = validateCommentInput({ text });

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        let comment = await Comment.findOne({
          where: { id: commentId },
          include: { all: true, nested: true },
        });

        let updatedComment = await comment.update({
          text,
        });

        return updatedComment;
      }
      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },

    async deleteComment(_, { id }, { user }) {
      if (user) {
        const deletedComment = await Comment.findOne({
          where: { id },
          include: { all: true, nested: true },
        });

        if (!deletedComment) {
          throw new UserInputError("Comment with provided id does not exist");
        }

        if (deletedComment.user.id !== user.id) {
          throw new UserInputError("Sorry, you're not the owner of this item!");
        }

        deletedComment.destroy();

        return deletedComment;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
