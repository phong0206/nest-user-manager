import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const EXPIRES_TIME_SECONDS = process.env.EXPIRES_TIME_SECONDS;

export const PORT = process.env.PORT 
