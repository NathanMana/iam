import User from "../entities/user";


class ValidationError extends Error {

    property: string;

    target: User;

    constructor(message: string, target: User, property: string) {
        super(message);
        this.name = "ValidationError";
        this.property = property;
        this.target = target;
    }

}

export default ValidationError;