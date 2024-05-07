import { BaseEntity } from "../base-entity";
import {
    IsString,
    IsNotEmpty,
    Matches,
} from 'class-validator';
import {
    Column,
    ManyToOne, Entity
} from 'typeorm';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Blog } from '../blogs/blog.entity'
const { CREATE, UPDATE } = CrudValidationGroups;

export enum ImageType {
    BLOG = 'blog',
    AVATAR = 'avatar'
}

@Entity('images')
export class Image extends BaseEntity {
    @Column({ type: 'varchar' })
    @IsString({ always: true })
    @IsNotEmpty({ groups: [CREATE], message: 'Origin name cannot be blank.' })
    originalname: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    @IsString({ always: true })
    @IsNotEmpty({ groups: [CREATE], message: 'Path cannot be blank.' })
    path: string;

    @Column({ type: 'varchar' })
    @IsString({ always: true })
    @Matches(/.*.(jpg|jpeg|png|gif)$/, {
        message: 'File types are not accepted, only accepted .jpg, .jpeg, .png, .gif.',
    })
    mimetype: string;

    @Column({ type: 'varchar' })
    @IsString({ always: true })
    @IsNotEmpty({ groups: [CREATE], message: 'Filename cannot be blank.' })
    filename: string;

    @Column({ type: 'varchar' })
    @IsString({ always: true })
    @IsNotEmpty({ groups: [CREATE], message: 'Size cannot be blank.' })
    @Matches(/^d+$/, { message: 'Size must be a positive number.' })
    size: string;

    @Column({ type: 'boolean' })
    isUsed: boolean;

    @Column({ nullable: false })
    userId: string;

    @Column({
        type: 'enum',
        enum: ImageType
    })
    typeImg: ImageType;

    @Column({ nullable: false })
    blogId: string;
    /**
    * Relations
    */

    @ManyToOne((type) => Blog, (b) => b.image)
    blog: Blog

}