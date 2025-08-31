const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("first and last name required !");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("invalid email address!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("enter strong password!");
  }
};

const validateProfileEditData = (req) => {
  const allowedUpdateFields = [
    "skills",
    "about",
    "gender",
    "age",
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedUpdateFields.includes(field)
  );
  if (!isEditAllowed) {
    throw new Error("Updates not allowed!");
  }

  const { skills, about, gender, age, firstName, lastName, emailId, photoUrl } =
    req.body;

  if (emailId && !validator.isEmail(emailId)) {
    throw new Error("invalid emailId !");
  }

  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Invalid photoUrl!");
  }

  if (firstName && !validator.isLength(firstName, { min: 3, max: 20 })) {
    throw new Error("Invalid firstName !");
  }

  if (lastName && !validator.isLength(lastName, { min: 3, max: 20 })) {
    throw new Error("Invalid lastname !");
  }

  if (about && !validator.isLength(about, { min: 10, max: 300 })) {
    throw new Error("Invalid about !");
  }

  // skill array validation
  const isValidSkillsLength = (arr, min, max) => {
    return Array.isArray(arr) && arr.length >= min && arr.length <= max;
  };

  if (skills && !isValidSkillsLength(skills, 1, 10)) {
    throw new Error("Skills must contain between 1 to 10 !");
  }

  // Gender validation
  if (gender !== undefined) {
    const validGenders = ["male", "female", "other"];
    if (
      gender !== null &&
      gender !== "" &&
      !validGenders.includes(gender.toLowerCase())
    ) {
      throw new Error("Gender must be male, female, or other!");
    }
  }

  // Age validation
  if (age !== undefined) {
    if (age !== null && age !== "" && (isNaN(age) || age < 18 || age > 100)) {
      throw new Error("Age must be a number between 18 and 100!");
    }
  }

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateProfileEditData,
};
