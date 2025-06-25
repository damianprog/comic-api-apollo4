import models from "../models/index.js";

const Comic = models["Comic"];

export default {
  Query: {
    async comic(_, { id }) {
      const comic = await Comic.findOne({ where: { id } });
      return comic;
    },
  },

  Mutation: {
    async createComic(_, { newComicInput }) {
      const comic = await Comic.create(newComicInput);
      return comic;
    },
  },
};
