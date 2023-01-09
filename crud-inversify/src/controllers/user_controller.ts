import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces, next, request, requestParam, response } from 'inversify-express-utils';
import { UserServiceImpl } from '../service/impl/user_service_impl';
import { UserService } from '../service/user_service';
import { User } from '../schemas/User';
import { getLogger } from '../connectors/logger';
import { httpRequestTimer } from '../connectors/prometheus';
import '../connectors/tracer'

const log = getLogger()

@controller('/user')
export class UserController implements interfaces.Controller {

    constructor(@inject(UserServiceImpl.name) private userServiceImpl: UserServiceImpl) { }

    @httpPost("/")
    public async createUser(@request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void | User> {
        const start = Date.now();
        try {
            log.info("Inicio Criação", { 'req': req.body });
            const user = new User(req.body.num_item, req.body.nome_item);

            log.info({
                message: `Started call: insert user.`, labels: {
                    'nome_item': user.nome_item,
                    'num_item': user.num_item
                }
            });
            const cUser: UserService = new UserServiceImpl()

            await cUser.createUser(user);

            log.info("Término Criação");
            res.status(200).send("User Created");
        } catch (error) {
            log.error(" ERROR : ", error);
            res.status(400).send("User Not Created: " + error);
        } finally {
            const responseTimeInMs = Date.now() - start;
            httpRequestTimer.labels(req.method, req.route.path, res.statusCode.toString()).observe(responseTimeInMs);
        }
    }

    @httpGet("/")
    public async getAllUsers(@request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void | User[]> {
        const start = Date.now();
        try {
            //log.info("Inicio getAll");
            const getUsers = await this.userServiceImpl.getAllUsers();

            res.status(200).send(getUsers)
        } catch (error) {
            res.status(400).send("Error to find the Users: " + error);
        } finally {
            const responseTimeInMs = Date.now() - start;
            httpRequestTimer.labels(req.method, req.route.path, res.statusCode.toString()).observe(responseTimeInMs);
        }
    }

    @httpGet("/:id")
    public async getUserById(@requestParam('id') id: number,
        @request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void | User> {
        try {
            const cUser: UserService = new UserServiceImpl();

            const getUser = await cUser.getUser(id);

            getUser
                ? res.status(200).send(getUser)
                : res.status(404).send(`User with id: ${id} not found`);

        } catch (error) {
            res.status(400).send("Error to find the Users: " + error);
        }
    }

    @httpDelete('/:id')
    public async deletUserById(@requestParam('id') id: number,
        @request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void> {
        try {
            const cUser: UserService = new UserServiceImpl();

            await cUser.delUser(id)

            res.status(200).send("User Deleted")

        } catch (error) {
            res.status(400).send("Error to delete the User: " + error);
        }
    }

    @httpPut('/:id')
    public async updateUser(@requestParam('id') id: number,
        @request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void> {
        const user = new User(req.body.num_item, req.body.nome_item);

        try {
            const cUser: UserService = new UserServiceImpl();

            await cUser.changeUser(id, user);

            res.status(200).send("User Changed")

        } catch (error) {
            res.status(400).send("Error to delete the User: " + error);
        }
    }

}
