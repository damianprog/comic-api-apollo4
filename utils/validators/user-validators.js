export const validateNickname = (nickname) => {
  const errors = {};
  const normalizedNickname = nickname?.trim() || "";

  if (normalizedNickname === "") {
    errors.nickname = "Nickname must not be empty";
  } else {
    if (normalizedNickname.length > 20) {
      errors.nickname = "Maximum length of nickname is 20";
    }

    if (normalizedNickname.length < 3) {
      errors.nickname = "Minimum length of nickname is 3";
    }
  }

  return errors;
};

export const validateEmail = (email) => {
  const errors = {};
  const normalizedEmail = email?.trim() || "";

  if (normalizedEmail === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!regEx.test(normalizedEmail)) {
      errors.email = "Email must be a valid email address";
    }
  }

  return errors;
};

export const validatePassword = (password) => {
  const errors = {};
  const normalizedPassword = password || "";

  if (normalizedPassword === "") {
    errors.password = "Password must not be empty";
  } else {
    if (normalizedPassword.length > 25) {
      errors.password = "Maximum length of password is 25";
    }

    if (normalizedPassword.length < 6) {
      errors.password = "Minimum length of password is 6";
    }
  }

  return errors;
};

export const validateBirthDate = (birthDate) => {
  const errors = {};
  const normalizedBirthDate = birthDate?.trim() || "";

  if (normalizedBirthDate === "") {
    errors.birthDate = "Birth date must not be empty";
  }

  return errors;
};

export const validateInterests = (interests) => {
  const errors = {};
  const normalizedInterests = interests?.trim() || "";

  if (normalizedInterests.length > 150) {
    errors.interests = "Maximum length of interests is 150";
  }

  return errors;
};

export const validateAbout = (about) => {
  const errors = {};
  const normalizedAbout = about?.trim() || "";

  if (normalizedAbout.length > 250) {
    errors.about = "Maximum length of about is 250";
  }

  return errors;
};

export const validateUserBookCategory = (category) => {
  const errors = {};
  const normalizedCategory = category?.trim() || "";

  if (normalizedCategory.length === 0) {
    errors.category = "Category must not be empty";
  } else if (normalizedCategory.length > 20) {
    errors.category = "Maximum length of category is 20";
  }

  return errors;
};
