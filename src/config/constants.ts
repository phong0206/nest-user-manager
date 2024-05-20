import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const EXPIRES_TIME_SECONDS = process.env.EXPIRES_TIME_SECONDS;
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
export const API_URL = process.env.API_URL;
export const REDIS_HOST = process.env.REDIS_HOST;
export const PORT = process.env.PORT 
export const APP_URL = process.env.APP_URL;

