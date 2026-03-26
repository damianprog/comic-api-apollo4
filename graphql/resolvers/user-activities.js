import models from "../models/index.js";
const Review = models["Review"];
const UserBook = models["UserBook"];
const Comment = models["Comment"];

export default {
  Query: {
    async userActivities(
      _,
      { userId, quantity = 10, lastActivityCreatedAt = 0 },
    ) {
      let userReviews = await Review.findAll({
        where: { userId },
        include: { all: true, nested: true },
      });

      let userBooks = await UserBook.findAll({
        where: { userId },
        include: { all: true, nested: true },
      });

      let comments = await Comment.findAll({
        where: { userId },
        include: { all: true, nested: true },
      });

      const sortedActivities = [...userReviews, ...userBooks, ...comments].sort(
        (a, b) => +b.createdAt - +a.createdAt,
      );

      const filteredActivities = lastActivityCreatedAt
        ? sortedActivities.filter(
            (userActivity) => +userActivity.createdAt < +lastActivityCreatedAt,
          )
        : sortedActivities;

      return filteredActivities.slice(0, quantity);
    },
  },
};
