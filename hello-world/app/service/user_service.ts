import express, { Request, Response } from 'express';
import { User } from '../schemas/User';
import { insertUser, 
         getAllUser, 
         getUser, 
         deleteUser,
         updateUser } from '../repository/repository'


const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  const u = new User(req.body.num_item, req.body.nome_item);

  const uu = await insertUser(u.num_item, u.nome_item)

  console.log(uu)
  res.send("User Created");
});

router.get("/", async (req: Request, res: Response) => {
  res.send(await getAllUser());
});

router.get("/:id", async (req: Request, res: Response) => {
  res.send(await getUser(req.params.id));
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


