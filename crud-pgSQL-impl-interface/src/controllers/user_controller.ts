import express, { Request, Response } from 'express';
import { User } from '../schemas/User';
import { UserServiceImpl } from '../service/impl/user_service_impl';


const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
    try {
        const user = new User(req.body.num_item, req.body.nome_item);

        const cUser = new UserServiceImpl()

        await cUser.createUser(user);

        res.status(200).send("User Created");
    } catch (error) {
        res.status(400).send("User Not Created: " + error);
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const cUser = new UserServiceImpl();

        const getUsers = await cUser.getAllUsers();

        res.status(200).send(getUsers)
    } catch (error) {
        res.status(400).send("Error to find the Users: " + error);
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const cUser = new UserServiceImpl();

        const getUser = await cUser.getUser(id);

        getUser
            ? res.status(200).send(getUser)
            : res.status(404).send(`User with id: ${id} not found`);

    } catch (error) {
        res.status(400).send("Error to find the Users: " + error);
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const cUser = new UserServiceImpl();

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
        const cUser = new UserServiceImpl();

        await cUser.changeUser(id, user);

        res.status(200).send("User Changed")
            
    } catch (error) {
        res.status(400).send("Error to delete the User: " + error);
    }
});

export default router