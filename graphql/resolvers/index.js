import comicsResolvers from "./comics.js";
import usersResolvers from "./users.js";
import reviewsResolvers from "./reviews.js";
import userComicsResolvers from "./user-comics.js";
import userActivitiesResolvers from "./user-activities.js";
import unions from "./unions.js";
import commentsResolvers from "./comments.js";

export default {
  Query: {
    ...comicsResolvers.Query,
    ...usersResolvers.Query,
    ...reviewsResolvers.Query,
    ...userComicsResolvers.Query,
    ...userActivitiesResolvers.Query,
    ...commentsResolvers.Query,
  },
  Mutation: {
    ...comicsResolvers.Mutation,
    ...usersResolvers.Mutation,
    ...reviewsResolvers.Mutation,
    ...userComicsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  ...unions,
};
