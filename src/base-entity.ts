import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class BaseEntity {
    @PrimaryGeneratedColumn() // auto generate id value when create a table
    id?: number;

    @CreateDateColumn({ nullable: true })
    createdAt?: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}