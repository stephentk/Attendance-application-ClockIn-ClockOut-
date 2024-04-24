import { CountryEnum } from '@app/my-library/enum/country.enum';
import { LoginDeviceEnum } from '@app/my-library/enum/login.enum';
import { countryValidator } from '@app/my-library/validator/country.validator';
import { phoneNumberValidator } from '@app/my-library/validator/phone.validator';
import * as Joi from 'joi';

const re = /^(?=.*\d)(?=.*[!@#$%^&*,?.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const registrationAttedanceValidator = Joi.object().keys({
  fullName: Joi.string().required().messages({
    'string.base': `Full name should be a type of string`,
    'any.required': `Full name field cannot be empty`,
  }),

  email: Joi.string().email().trim().required().messages({
    'string.base': `Email should be a type of email`,
    'any.required': `Email field cannot be empty`,
  }),



  password: Joi.string().pattern(new RegExp(re)).trim().required().messages({
    'string.pattern.base': `Password should have at lease 8 characters, numbers and special characters`,
    'string.base': `Password should be a type of 'text'`,
    'any.required': `Password cannot be empty`,
  }),

  department: Joi.string().optional().messages({
    'string.base': `department should be a type of 'string'`,
    'any.required': `department  may be empty empty`,
  }),

});