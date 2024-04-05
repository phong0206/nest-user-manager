// user.entity.ts
import {
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    IsNumber,
    IsNotEmpty,
    Min,
    Max,
    IsEmail,
    IsBoolean,
} from 'class-validator';
import {
    Entity,
    Column,
    OneToMany,
} from 'typeorm';
import { BaseEntity } from "../base-entity"
import { CrudValidationGroups } from '@nestjsx/crud';
import { Type } from 'class-transformer';
import { Blog } from '../blogs/blog.entity'
const { CREATE, UPDATE } = CrudValidationGroups;

export class Name {
    @IsString({ always: true })
    @IsOptional({ groups: [UPDATE] })
    @MinLength(3, { always: true, message: "First name must be at least 3 characters long" })
    @Column({ nullable: true })
    first: string;

    @IsString({ always: true })
    @IsOptional({ groups: [UPDATE] })
    @MinLength(3, { always: true, message: "Last name must be at least 3 characters long" })
    @Column({ nullable: true })
    last: string;
}
@Entity('users')
class User extends BaseEntity {
    @IsOptional({ groups: [UPDATE] }) // can be ignore in method update
    @IsNotEmpty({ groups: [CREATE] })
    @IsString({ always: true })
    @MaxLength(255, { always: true })
    @IsEmail({ require_tld: false }, { always: true })
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;

    @IsNotEmpty({ groups: [CREATE] })
    @IsString({ always: true })
    @MinLength(6, { always: true, message: "Password must be at least 6 characters long" })
    @Column({ nullable: false })
    password: string;

    @Type((t) => Name)
    @Column((type) => Name)
    name: Name;

    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @IsBoolean({ always: true })
    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    @IsOptional({ groups: [UPDATE] })
    @Column({ type: 'integer' })
    @IsNumber({}, { always: true, message: "Age must be a number" })
    @Min(0, { always: true, message: "Age must be at least 0" })
    @Max(100, { always: true, message: "Age must not exceed 100" })
    @Column({ type: 'integer', default: 0 })
    age: number;

    /**
    * Relations
    */

    @OneToMany((type) => Blog, (b) => b.user, {
        persistence: false,
        onDelete: 'CASCADE',
    })
    @Type(() => Blog)
    blog: Blog[];
}
export default User;

