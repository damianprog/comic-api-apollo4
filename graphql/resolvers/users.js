import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserInputError, AuthenticationError } from "apollo-server-errors";
// import { cloudinary } from "../../utils/cloudinary";
import { Op } from "sequelize";

import {
  validateSignupInput,
  validateSigninInput,
  validateUpdateUserInput,
} from "../../utils/validators/user-mutations-validators.js";
import JWT_SECRET from "../../config.js";
import updateUserProperties from "../resolvers-utils/users-utils.js";

import models from "../models/index.js";
const User = models["User"];
const UserDetails = models["UserDetails"];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default {
  Query: {
    async user(_, { where: { id, nickname } }) {
      const foundUser = await User.findOne({
        where: {
          [Op.or]: [
            {
              id: id ? id : 0,
            },
            {
              nickname: nickname ? nickname : "",
            },
          ],
        },
        include: "userDetails",
      });

      if (foundUser) return foundUser;

      throw new UserInputError("User not found");
    },
    // async currentUser(_, args, { user }) {
    //   if (user) {
    //     const signedUser = await User.findOne({
    //       where: { id: user.id },
    //       include: "userDetails",
    //     });
    //     return signedUser;
    //   }
    //   throw new AuthenticationError("Sorry, you're not an authenticated user!");
    // },
  },
  Mutation: {
    async signin(_, { email, password }, { res }) {
      const { errors, valid } = validateSigninInput({ email, password });

      if (!valid) {
        throw new UserInputError("Errors", errors);
      }

      const user = await User.findOne({
        where: { email },
        include: "userDetails",
      });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", errors);
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", errors);
      }

      const token = generateToken(user);

      return {
        ...user.dataValues,
        token,
      };
    },
    async signup(_, { signupInput }, { res }) {
      const { nickname, email, password } = signupInput;

      const { valid, errors } = validateSignupInput(signupInput);

      if (!valid) {
        throw new UserInputError("Errors", errors);
      }

      const duplicateErrors = {};

      const userWithNickname = await User.findOne({ where: { nickname } });
      if (userWithNickname) duplicateErrors.nickname = "This nickname is taken";

      const userWithEmail = await User.findOne({ where: { email } });
      if (userWithEmail) duplicateErrors.email = "This email is taken";

      if (Object.keys(duplicateErrors).length > 0) {
        throw new UserInputError("Errors", duplicateErrors);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        ...signupInput,
        password: hashedPassword,
      });

      const userDetails = await UserDetails.create({ userId: newUser.id });

      newUser.userDetails = userDetails;

      const token = generateToken(newUser);

      return {
        ...newUser.dataValues,
        userDetails: userDetails.dataValues,
        token,
      };
    },

    async updateUser(_, { updateUserInput }, { user }) {
      if (user) {
        const { valid, errors } = validateUpdateUserInput(updateUserInput);

        if (!valid) {
          throw new UserInputError("Errors", errors);
        }

        let signedUser = await User.findOne({
          where: { id: user.id },
          include: "userDetails",
        });

        signedUser = await updateUserProperties(signedUser, updateUserInput);

        await signedUser.userDetails.save();
        await signedUser.save();

        return signedUser;
      }

      throw new AuthenticationError("Sorry, you're not an authenticated user!");
    },
  },
};
