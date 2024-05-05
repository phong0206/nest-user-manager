import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from "./config/constants"
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as xss from 'xss-clean';
import * as csurf from 'csurf';
import rateLimit from 'express-rate-limit';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  app.enableCors(corsOptions);

  // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
  app.use(helmet());
  app.use(xss());
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));


  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  await app.listen(process.env.PORT || 5000, () => {
    console.log(`listening on port ${PORT}`);
  });
}
bootstrap();
