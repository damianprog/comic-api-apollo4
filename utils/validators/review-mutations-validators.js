import { validateText } from "./review-validators.js";

export const validateReviewInput = ({ text }) => {
  const textErrors = validateText(text);
  const errors = {
    ...textErrors,
  };

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
