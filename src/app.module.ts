import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { withCache } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(withCache),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
