
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
import { User } from "../users/user.entity";


@Entity('follows')
export class Follow extends BaseEntity {

    // example: A follows B: userId: A, followId: B

    @Column({ type: 'text', nullable: false, default: null })
    @IsOptional({ groups: [UPDATE] })
    @IsString({ always: true })
    user_id: string;

    @Column({ type: 'text', nullable: false, default: null })
    @IsOptional({ groups: [UPDATE] })
    @IsString({ always: true })
    followed_id: string;


    /**
    * Relations
    */

    @ManyToOne((type) => User, (u) => u.follow)
    user: User;
    

    
}