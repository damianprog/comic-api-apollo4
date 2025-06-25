const { validateText } = require('./comment-validators');

module.exports.validateCommentInput = ({ text }) => {
  const textErrors = validateText(text);
  const errors = {
    ...textErrors,
  };

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
