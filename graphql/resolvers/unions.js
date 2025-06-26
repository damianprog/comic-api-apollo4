export default {
  UserActivity: {
    __resolveType(obj) {
      return obj.typename;
    },
  },
};
