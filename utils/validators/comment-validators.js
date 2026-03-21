export const validateText = (text) => {
  const errors = {};
  const normalizedText = text?.trim() || "";

  if (normalizedText.length === 0) {
    errors.text = "Comment must not be empty";
  }

  if (normalizedText.length > 5000) {
    errors.text = "Maximum length of comment is 5000";
  }

  return errors;
};
