const joi = require("joi");
const { USER_CREATION_VARIABLE } = require("../utils/constants");

const joiUserCreationSchema = joi.object({
  name: joi.string().required(),
  password: joi
    .string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,15}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 8-15 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

module.exports = { joiUserCreationSchema }; // Using named export
