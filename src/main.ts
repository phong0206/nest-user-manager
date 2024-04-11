import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from "./config/constants"
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(process.env.PORT || 3000, () => {
    console.log(`listening on port ${PORT}`);
  });
}
bootstrap();
