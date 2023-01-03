import express, { Request, Response } from 'express';
import { User } from '../schemas/User';
import {
  insertUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser
} from '../repository/repository'
import { tedis } from '../connectors/redisconnector'
import dotenv from 'dotenv'


const router = express.Router()
const cache = tedis;
dotenv.config();
const ttl = process.env.TTL; 

router.post("/", async (req: Request, res: Response) => {
  const u = new User(req.body.num_item, req.body.nome_item);

  const uu = await insertUser(u.num_item, u.nome_item)

  console.log(uu)
  res.send("User Created");
});


router.get("/", async (req: Request, res: Response) => {
  try {
    if (await cache.exists("getAll")) {
      console.log("cache")
      res.send(await cache.get("getAll"));
    } else {    
      const users: User[] = await getAllUser()
      
      await cache.setex("getAll", ttl, JSON.stringify(users));
      
      console.log("banco")
      res.send(users);
    }

  } catch (error) {
    res.send(error)
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id
  const indice = "getbyid" + "-" + id.toString()
  console.log(indice)
  try {
    if (await cache.exists(indice)) {
      console.log("cache")
      res.send(await cache.get(indice));
    } else {    
       const user = await getUser(id)

       await cache.setex(indice, ttl, JSON.stringify(user));
       console.log("banco")
       res.send(user);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await deleteUser(req.params.id);
  res.send("Deleted Users");
});

router.put("/:id", async (req: Request, res: Response) => {
  await updateUser(req.params.id, req.body.num_item, req.body.nome_item);
  res.send("Updated Users");
});

export default router


