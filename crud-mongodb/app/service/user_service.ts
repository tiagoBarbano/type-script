import express, { Request, Response } from 'express';
import { ObjectId } from "mongodb";
import { collections } from '../connectors/dbconnector'
import User from "../models/user";

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;
    const result = await collections.users?.insertOne(newUser)
    console.log(result)

    result
        ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
        : res.status(500).send("Failed to create a new game.");
} catch (error) {
    console.error(error);
    res.status(400).send(error);
}
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const user = await collections.users?.find().toArray()
      //collections.users.find({}).toArray()) as User[];

     res.status(200).send(user);
 } catch (error) {
     res.status(500).send(error);
 }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
      
      const query = { _id: new ObjectId(id) };
      const user = await collections.users?.findOne(query)
      
      //(await collections.users.findOne(query)) as User;

      if (user) {
          res.status(200).send(user);
      }
  } catch (error) {
      res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id; 

  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);

    if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed game with id ${id}`);
    } else if (!result) {
        res.status(400).send(`Failed to remove game with id ${id}`);
    } else if (!result.deletedCount) {
        res.status(404).send(`Game with id ${id} does not exist`);
    }
} catch (error) {
    console.error(error);
    res.status(400).send(error);
}
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
      const updatedUser: Game = req.body as Game;
      const query = { _id: new ObjectId(id) };
    
      const result = await collections.users?.updateOne(query, { $set: updatedUser})

      result
          ? res.status(200).send(`Successfully updated game with id ${id}`)
          : res.status(304).send(`Game with id: ${id} not updated`);
  } catch (error) {
      console.error(error);
      res.status(400).send(error);
  }
});

export default router


