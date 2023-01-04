import express, { Request, Response } from 'express';
import { User } from '../schemas/User';
import { UserServiceImpl } from '../service/impl/user_service_impl';
import { UserService } from '../service/user_service';
import { getLogger } from '../utils/logger';

const log = getLogger()

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
    try {
        log.info("Inicio controller post createUser")
        const user = new User(req.body.num_item, req.body.nome_item);

        const cUser: UserService = new UserServiceImpl()

        await cUser.createUser(user);

        log.info("termino controller post createUser")
        res.status(200).send("User Created");
    } catch (error) {
        log.error("### ERROR ### : ", error)
        res.status(400).send("User Not Created: " + error);
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        log.info("Inicio controller get getAll")
        const cUser: UserService = new UserServiceImpl();

        const getUsers = await cUser.getAllUsers();

        log.info("Término controller get GetAll")
        res.status(200).send(getUsers)
    } catch (error) {
        log.error(" ### ERROR ### ", error)
        res.status(400).send("Error to find the Users: " + error);
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        log.info("Inicio controller get getById", id)
        const cUser: UserService = new UserServiceImpl();

        const getUser = await cUser.getUser(id);
        
        if (getUser){
            log.info("User finded: ", getUser)
            res.status(200).send(getUser)
        }else{
            log.info("User with id: ${id} not found", id);
            res.status(404).send(`User with id: ${id} not found`);
        }

    } catch (error) {
        log.info(" ### ERROR ### ", error)
        res.status(400).send("Error to find the Users: " + error);
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const cUser: UserService = new UserServiceImpl();

        await cUser.delUser(id)

        res.status(200).send("User Deleted")
            
    } catch (error) {
        res.status(400).send("Error to delete the User: " + error);
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = new User(req.body.num_item, req.body.nome_item);
    
    try {
        const cUser: UserService = new UserServiceImpl();

        await cUser.changeUser(id, user);

        res.status(200).send("User Changed")
            
    } catch (error) {
        res.status(400).send("Error to delete the User: " + error);
    }
});

export default router