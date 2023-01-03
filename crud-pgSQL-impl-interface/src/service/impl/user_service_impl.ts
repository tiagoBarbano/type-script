import {
  deleteUser,
  getAllUser,
  getUser,
  insertUser,
  updateUser
} from '../../repository/repository';
import { User } from '../../schemas/User';
import { UserService } from '../user_service';



export class UserServiceImpl implements UserService {

  public async createUser(user: User): Promise<void | User> {
    await insertUser(user.num_item, user.nome_item);
  }

  public async getAllUsers(): Promise<void | User[]> {
    return await getAllUser();
  }

  public async getUser(id: number): Promise<void | User> {
    return await getUser(id);
  }

  public async delUser(id: number): Promise<void | String> {
    await deleteUser(id);
  }
  public async changeUser(id: number, user: User): Promise<void | User> {
    await updateUser(id, user.num_item, user.nome_item);
  }

}

