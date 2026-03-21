import { validateText } from "./comment-validators.js";

export const validateCommentInput = ({ text }) => {
  const textErrors = validateText(text);
  const errors = {
    ...textErrors,
  };

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
