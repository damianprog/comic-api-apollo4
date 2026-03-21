export const validateText = (text) => {
  const errors = {};
  const normalizedText = text?.trim() || "";

  if (normalizedText.length === 0) {
    errors.text = "Review must not be empty";
  }

  if (normalizedText.length > 5000) {
    errors.text = "Maximum length of review is 5000";
  }

  return errors;
};
