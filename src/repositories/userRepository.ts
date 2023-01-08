import { DataSource, Repository } from "typeorm";
import User from "./../entities/user";

/**
 * Utilisation du datasource au moment de l'initialisation de l'objet, autrement il y a une référence cyclique qui lance une erreur
 */
export default class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  /**
   * Supprime tous les éléments de la table
   */
  truncate = async () => {
    const truncateResult = await this.repository
      .createQueryBuilder("users")
      .delete()
      .from(User)
      .execute();

    return truncateResult;
  };

  add = async (user: User) => {
    await this.repository.save(user);
  };

  findByFirstname = async (firstname: string) => {
    const user = this.repository.findOneBy({
      firstname: firstname,
    });
    return user;
  };

  findByEmail = async (email: string) => {
    return this.repository.findOneBy({
      email: email,
    });
  };
}
