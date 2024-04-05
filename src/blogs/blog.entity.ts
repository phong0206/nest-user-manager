
import { BaseEntity } from "../base-entity"
import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import {
    IsOptional,
    IsString,
    MinLength,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
const { CREATE, UPDATE } = CrudValidationGroups;

import { Type } from 'class-transformer';
import  User  from "../users/user.entity";
import { Image } from "../images/image.entity";


@Entity('blogs')
export class Blog extends BaseEntity {
    @Column({ type: 'text', nullable: true, default: null })
    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @IsString({ always: true })
    @MinLength(3, { always: true, message: "Title must be at least 3 characters long" })
    title: string;

    @Column({ type: 'text', nullable: true, default: null })
    @IsOptional({ groups: [UPDATE] })
    @IsString({ always: true })
    @MinLength(3, { always: true, message: "Content must be at least 3 characters long" })
    content: string;

    @Column()
    @IsOptional({ groups: [UPDATE] })
    @IsString({ always: true })
    @MinLength(3, { always: true, message: "Author must be at least 3 characters long" })
    author: string;

    @Column()
    @IsOptional({ groups: [UPDATE] })
    @IsNumber({}, { always: true })
    view: number;

    @Column({ nullable: false })
    userId: string;

    
    /**
    * Relations
    */

    @ManyToOne((type) => User, (u) => u.blog)
    user: User;

    @OneToMany((type) => Image, (i) => i.blog, {
        persistence: false,
        onDelete: 'CASCADE',
    })
    @Type(() => Image)
    image: Image[];

}