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
import * as bcrypt from "bcrypt"
import { validatePassword } from "../lib/passwordEntropy";
import { error } from "console";

@Entity()
class User {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    firstname!: string;
    
    @Column()
    lastname!: string;
    
    @UniqueInColumn({ message: "Email should be unique" })
    @Column()
    @Index({unique: true})
    @IsNotEmpty({message: 'email should not be empty'})
    email!: string;
    
    @Column()
    passwordHash!: string;

    constructor(firstname?: string, lastname?: string, email?: string) {
        if (lastname) this.lastname = lastname;
        if (firstname) this.firstname = firstname;
        if (email) this.email = email.toLowerCase();
    }

    @BeforeInsert()
    @BeforeUpdate()
    formatEmail() {
        if (this.email) this.email = this.email.toLowerCase();
    }

    async setPassword(passwordDto: SetPasswordDTO) {
        if (passwordDto.password !== passwordDto.passwordConfirmation) {
          throw error("password confirmation and password does not match");
        }
        if (!validatePassword(passwordDto.password)){
          throw error("password cannot be validated")
        }
        this.passwordHash = await bcrypt.hash(passwordDto.password, 10);
      }

    async isPasswordValid(password: string): Promise<boolean> {
      return await bcrypt.compare(password, this.passwordHash)
    }
}

export class SetPasswordDTO {
    password!: string;
    passwordConfirmation!: string;
}

export default User;
