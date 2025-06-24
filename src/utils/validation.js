const validator = require('validator');


const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  
  if (!firstName || !lastName) {
    throw new Error("first and last name required !");
  }

  else if (!validator.isEmail(emailId)) {
    throw new Error('invalid email address!')
  }

  else if (!validator.isStrongPassword(password)) {
    throw new Error('enter strong password!');
  }

}

module.exports = {
  validateSignUpData,
}