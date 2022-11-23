import User from "./../entities/user"
import {AppDataSource} from "./../lib/typeorm";

const userRepository = AppDataSource.getRepository(User)

/**
 * Supprime tous les éléments de la table
 */
const truncate = async () => {
    const truncateResult = await userRepository
        .createQueryBuilder('users')
        .delete()
        .from(User)
        .execute()

    return truncateResult
}

const add = async (user: User) => {
    await userRepository.save(user)
}

const findByFirstname  = async (firstname: string) => {
    const user = userRepository.findOneBy({
        firstname: firstname
    })
    return user
}

export default {truncate, add, findByFirstname};