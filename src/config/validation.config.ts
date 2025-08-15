import * as joi from 'joi';

export const validationSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid('development', 'production', 'testing', 'staging')
    .default('development'),
  PORT: joi.number().default(3000),
  MONGO_URI: joi.string().required(),
  JWT_SECRET: joi.string().min(24).required(),
  JWT_EXPIRES_IN: joi.string().default('1h'),
});
