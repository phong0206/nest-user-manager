import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from '@nestjsx/util';

export const withCache: TypeOrmModuleOptions = {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432 ,
    username: 'root',
    password: 'root',
    database: 'nestjsx_user_manager',
    synchronize: true,
    logging: !isNil(process.env.TYPEORM_LOGGING) ? !!parseInt(process.env.TYPEORM_LOGGING, 10) : true,
    entities: [join(__dirname, './**/*.entity{.ts,.js}')],
};