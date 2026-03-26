import booksResolvers from "./books.js";
import usersResolvers from "./users.js";
import reviewsResolvers from "./reviews.js";
import userBooksResolvers from "./user-books.js";
import userActivitiesResolvers from "./user-activities.js";
import unions from "./unions.js";
import commentsResolvers from "./comments.js";

export default {
  Query: {
    ...booksResolvers.Query,
    ...usersResolvers.Query,
    ...reviewsResolvers.Query,
    ...userBooksResolvers.Query,
    ...userActivitiesResolvers.Query,
    ...commentsResolvers.Query,
  },
  Mutation: {
    ...booksResolvers.Mutation,
    ...usersResolvers.Mutation,
    ...reviewsResolvers.Mutation,
    ...userBooksResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  ...unions,
};
