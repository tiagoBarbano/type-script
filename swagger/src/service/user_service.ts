import { User } from "../schemas/User";


export interface UserService{

    createUser(user: User): Promise<void | User>;
    getUser(id: number): Promise<void | User>;
    getAllUsers(): Promise<void | User[]>;
    delUser(id: number): Promise<void | String>;
    changeUser(id: number, user: User): Promise<void | User>;

}
    