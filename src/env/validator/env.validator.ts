import { ConfigEnum, EnvNodeEnv } from './../enum/env.enum';
import { baseEnvValidator } from '@app/my-library/env/validator/env.validator';
import * as Joi from 'joi';

// extend from the base needed in the library
export const envValidator = baseEnvValidator.append({
  [ConfigEnum.NODE_ENV]: Joi.string()
    .valid(...Object.values(EnvNodeEnv))
    .required(),
  [ConfigEnum.CLOUDINARY_API_KEY]: Joi.string().trim().required(),
  [ConfigEnum.CLOUDINARY_API_SECRET]: Joi.string().trim().required(),
  [ConfigEnum.CLOUDINARY_NAME]: Joi.string().trim().required(),
  [ConfigEnum.WALLET_SERVER_SECRET]: Joi.string().trim().required(),
  [ConfigEnum.IDENTITYPASS_SEC_KEY]: Joi.string().trim().required(),
  [ConfigEnum.IDENTITYPASS_APP_ID]: Joi.string().trim().required(),
  [ConfigEnum.FRONTEND_URL]: Joi.string().trim().required(),
  [ConfigEnum.STRIPE_API_SECRET]: Joi.string().trim().required(),
  [ConfigEnum.SERVER_URL]: Joi.string().trim().required(),
  [ConfigEnum.STRIPE_ACCOUNT]: Joi.string().trim().required(),
  [ConfigEnum.PATHWAY_SERVER]: Joi.string().trim().required(),
  [ConfigEnum.SENDGRID_API_KEY]: Joi.string().trim().required(),
  [ConfigEnum.API_ENCRYPT_AND_DECRYPT_KEY]: Joi.string().trim().required(),
  [ConfigEnum.PROVIDUS_WEBHOOK_SECRET]: Joi.string().trim().required(),
  [ConfigEnum.WALLET_SERVER]: Joi.string().trim().required(),
});
