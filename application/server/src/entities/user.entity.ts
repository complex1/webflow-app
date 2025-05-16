import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({ type: 'varchar' })
    name!: string;

  @Column({ type: 'varchar', unique: true })
    email!: string;

  @Column({ type: 'varchar' })
    password!: string;

  @Column({ type: 'varchar', nullable: true })
    avatar!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt!: Date;
}
