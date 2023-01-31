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
import { EntityError } from "../errors/entity-error";

@Entity()
class User {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    firstname: string;
    
    @Column()
    lastname: string;
    
    @UniqueInColumn({ message: "Email should be unique" })
    @Column()
    @Index({unique: true})
    @IsNotEmpty({message: 'email should not be empty'})
    email!: string;
    
    @Column()
    passwordHash!: string;

    constructor(firstname: string, lastname: string, email?: string) {
        this.firstname = firstname;
        this.lastname = lastname;

        if (email) this.email = email.toLowerCase();
    }

    @BeforeInsert()
    @BeforeUpdate()
    formatEmail() {
        if (this.email) this.email = this.email.toLowerCase();
    }

    async setPassword(passwordDto: SetPasswordDTO) {
        if (passwordDto.password !== passwordDto.passwordConfirmation) {
          throw new EntityError("password confirmation and password does not match", passwordDto);
        }
        if (!validatePassword(passwordDto.password)){
          throw new EntityError("password cannot be validated", passwordDto);
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
