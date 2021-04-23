const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const postSchema = Joi.object({
  title: Joi.string().min(4).max(30).required(),
  body: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string()),
});

module.exports = postSchema;
