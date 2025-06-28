import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { OpenApiDocConfig } from '../models/webflow.model';
@Entity('webflows')
export class Webflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ nullable: true })
  icon: string;

  @Column('json', { nullable: true })
  data: any;

  @Column('json', { nullable: true })
  openApiDocConfig: OpenApiDocConfig;
}