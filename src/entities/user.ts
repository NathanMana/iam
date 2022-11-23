import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;
    
    @Column()
    lastname: string;
    
    @Column()
    email: string;
    
    @Column()
    passwordHash: string;

    constructor(id: number, firstname: string, lastname: string, email: string, passwordHash: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.passwordHash = passwordHash;
    }
}


export default User;