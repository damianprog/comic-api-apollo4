module.exports.validateText = (text) => {
  const errors = {};
  if (text.trim().length === 0) {
    errors.text = 'Comment must not be empty';
  }
  if (text.length > 5000) {
    errors.text = 'Maximum length of comment is 1000';
  }

  return errors;
};
