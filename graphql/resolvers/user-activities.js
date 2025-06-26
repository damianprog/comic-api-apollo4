import models from "../models/index.js";
const Review = models["Review"];
const UserComic = models["UserComic"];
const Comment = models["Comment"];

export default {
  Query: {
    async userActivities(
      _,
      { userId, quantity = 10, lastActivityCreatedAt = 0 }
    ) {
      let userReviews = await Review.findAll({
        where: { userId },
        include: { all: true, nested: true },
      });
      let userComics = await UserComic.findAll({
        where: { userId },
        include: { all: true, nested: true },
      });
      let comments = await Comment.findAll({
        where: { userId },
        include: { all: true, nested: true },
      });

      const sortedActivities = [
        ...userReviews,
        ...userComics,
        ...comments,
      ].sort((a, b) => +b.createdAt - +a.createdAt);

      const previousLastActivityIndex = sortedActivities.findIndex(
        (userActivity) => +userActivity.createdAt === +lastActivityCreatedAt
      );

      const currentFirstActivityIndex = previousLastActivityIndex + 1;

      const userActivities = sortedActivities.slice(
        currentFirstActivityIndex,
        currentFirstActivityIndex + quantity
      );

      return userActivities;
    },
  },
};
