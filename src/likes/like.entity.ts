
import { BaseEntity } from "../base-entity"
import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    OneToOne,
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
import { User } from "../users/user.entity";
import { Blog } from "../blogs/blog.entity";



@Entity('follows')
export class Like extends BaseEntity {

    // example: A likes blog B: userId: A, blogid: B

    @Column({ type: 'text', nullable: false, default: null })
    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @IsString({ always: true })
    user_id: string;

    @Column({ type: 'text', nullable: false, default: null })
    @IsOptional({ groups: [UPDATE] })
    @IsNotEmpty({ groups: [CREATE] })
    @IsString({ always: true })
    blog_id: string;


    /**
    * Relations
    */

    @OneToOne((type) => User, (u) => u.like)
    user: User;

    @ManyToOne((type) => Blog, (b) => b.like)
    blog: Blog;
}