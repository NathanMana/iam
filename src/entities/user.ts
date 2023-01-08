import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { UniqueInColumn } from "../decorators/uniqueInColumn";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @UniqueInColumn({ message: "Email should be unique" })
  @Column()
  @Index({ unique: true })
  @IsNotEmpty({ message: "email should not be empty" })
  email!: string;

  @Column()
  passwordHash: string;

  constructor(
    firstname: string,
    lastname: string,
    passwordHash: string,
    email?: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.passwordHash = passwordHash;

    if (email) this.email = email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  formatEmail() {
    if (this.email) this.email = this.email.toLowerCase();
  }
}

export default User;
