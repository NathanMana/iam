import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm"
import ValidationError from "../errors/ValidationError";

@Entity()
class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstname: string;
    
    @Column()
    lastname: string;
    
    @Column()
    email!: string;
    
    @Column()
    passwordHash: string;

    constructor(firstname: string, lastname: string, passwordHash: string, email?: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.passwordHash = passwordHash;

        if (email) this.email = email;
    }

    @BeforeInsert()
    @BeforeUpdate()
    checkEmail() {
        if (!this.email) throw new ValidationError("Email is required !", this, "email"); 
    }
}


export default User;