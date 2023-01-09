import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, Index, ValueTransformer } from "typeorm"
import { IsEmail, IsNotEmpty, ValidationError } from 'class-validator'
import * as bcrypt from "bcrypt"
import { resolve } from "path";

@Entity()
class User {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    firstname: string;
    
    @Column()
    lastname: string;
    
    @Column()
    @Index({unique: true})
    @IsNotEmpty({message: 'email should not be empty'})
    email!: string;
    
    @Column()
    // TODO: create a validation for password entropy
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
          throw new ValidationError();
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