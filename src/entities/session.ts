import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./user";
import * as crypto from "crypto";

@Entity()
export default class Session {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    length: 512,
  })
  token!: string;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user!: User;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  expiresAt!: Date;

  @Column({
    nullable: true,
  })
  revokedAt?: Date;

  generateToken() {
    return crypto.randomBytes(384 / 8).toString("base64");
  }

  @BeforeInsert()
  initPersitance() {
    this.token = this.generateToken();

    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + 1000 * 60 * 60 * 3);
    this.expiresAt = currentDate; // +3h
  }
}
