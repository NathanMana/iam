import { DataSource, Repository } from "typeorm";
import Session from "./../entities/session";

/**
 * Utilisation du datasource au moment de l'initialisation de l'objet, autrement il y a une référence cyclique qui lance une erreur
 */
export default class SessionRepository {
  private repository: Repository<Session>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Session);
  }

  /**
   * Supprime tous les éléments de la table
   */
  truncate = async () => {
    const truncateResult = await this.repository
      .createQueryBuilder("sessions")
      .delete()
      .from(Session)
      .execute();

    return truncateResult;
  };

  add = async (session: Session) => {
   return await this.repository.save(session);
  };

  save = async (session: Session) => {
    return this.repository.save(session);
  }

  findFirst = async () => {
    return (await this.repository.find({
        take: 1
    })).pop();
  }


}
