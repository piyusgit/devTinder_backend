const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateEditData = (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
  ];
  const isAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_UPDATES.includes(field)
  );
  return isAllowed;
};

const validatePasswordData = (req) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    throw new Error("Fields are required");
  }
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please enter a strong password!");
  }
};
module.exports = { validateSignUpData, validateEditData, validatePasswordData };
