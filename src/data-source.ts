// src/data-source.ts

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'phong0206',
    database: 'manager_user',
    entities: ['./**/*.entity.ts'],
    logging: true,
});

(async () => {
    try {
        // Kết nối đến cơ sở dữ liệu.
        await AppDataSource.initialize();

        // Thực thi truy vấn SELECT * FROM current_schema().
        const currentSchema = await AppDataSource.query("SELECT * FROM current_schema()");
        console.log(currentSchema);

        // Thực thi truy vấn SELECT version().
        const version = await AppDataSource.query("SELECT version()");
        console.log(version);

        // Kết thúc kết nối khi các truy vấn đã hoàn thành.
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error: ', error);
    }
})();
