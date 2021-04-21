const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(8).max(20).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  address: Joi.string().min(8).max(40).required(),
  age: Joi.number().min(18).required(),
});

module.exports = userSchema;
