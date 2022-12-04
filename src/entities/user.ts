import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

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
}


export default User;