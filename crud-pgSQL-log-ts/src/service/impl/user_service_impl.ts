import {
  deleteUser,
  getAllUser,
  getUser,
  insertUser,
  updateUser
} from '../../repository/repository';
import { User } from '../../schemas/User';
import { UserService } from '../user_service';
import { Logger } from "tslog";

const log = new Logger();


export class UserServiceImpl implements UserService {
  
  public async createUser(user: User): Promise<void | User> {
    log.info("Inicio service Impl - CreateUser", user);
    await insertUser(user.num_item, user.nome_item);
    log.info("Término srvice Impl - CreateUser");
  }

  public async getAllUsers(): Promise<void | User[]> {
    log.info("Inicio service Impl - getAllUsers");
    return await getAllUser();
  }

  public async getUser(id: number): Promise<void | User> {
    log.info("Inicio service Impl - getUser");
    return await getUser(id);
    
  }

  public async delUser(id: number): Promise<void | String> {
    log.info("Inicio service Impl - delUser", id);
    await deleteUser(id);
    log.info("Inicio service Impl - delUser");
  }

  public async changeUser(id: number, user: User): Promise<void | User> {
    log.info("Inicio service Impl - changeUser", id);
    await updateUser(id, user.num_item, user.nome_item);
    log.info("Inicio service Impl - changeUser");
  }

}

