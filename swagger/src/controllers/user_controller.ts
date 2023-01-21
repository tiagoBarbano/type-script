import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces, next, request, requestParam, response } from 'inversify-express-utils';
import { UserServiceImpl } from '../service/impl/user_service_impl';
import { User } from '../schemas/User';
import { getLogger } from '../connectors/logger';
import { httpRequestTimer } from '../connectors/prometheus';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from '@inversify-cn/swagger-express-ts';

const log = getLogger()

@ApiPath({
    path: "/user",
    name: "Users",
    security: { basicAuth: [] }
})
@controller('/user')
export class UsersController implements interfaces.Controller {

    constructor(@inject(UserServiceImpl.name) private userServiceImpl: UserServiceImpl) { }

    @ApiOperationPost({
        description: "Post user object",
        summary: "Post new user",
        parameters: { body: { description: "New user", required: true, model: "User" } },
        responses: {
            200: { model: "User", description: "Success" },
            400: { description: "Parameters fail" }
        }
    })
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

            await this.userServiceImpl.createUser(user);

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
    @ApiOperationGet({
        description: "Get users objects list",
        summary: "Get users list",
        responses: { 200: { description: "Success", type: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "User" } }
    })
    @httpGet("/")
    public async getAllUsers(@request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void | User[]> {
        const start = Date.now();
        try {
            log.info("Inicio getAll");
            const getUsers = await this.userServiceImpl.getAllUsers();

            res.status(200).send(getUsers)
        } catch (error) {
            res.status(400).send("Error to find the Users: " + error);
        } finally {
            const responseTimeInMs = Date.now() - start;
            httpRequestTimer.labels(req.method, req.route.path, res.statusCode.toString()).observe(responseTimeInMs);
        }
    }
}

@ApiPath({
    path: "/user/id",
    name: "User",
    security: { basicAuth: [] }
})
@controller('/user')
export class UserController implements interfaces.Controller {

    constructor(@inject(UserServiceImpl.name) private userServiceImpl: UserServiceImpl) { }

    @ApiOperationGet({
        description: "Get users objects",
        summary: "Get user by id",
        parameters: { path: { id: { required: true, type: SwaggerDefinitionConstant.Parameter.Type.NUMBER } } },
        responses: { 200: { description: "Success", type: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "User" } }
    })
    @httpGet("/:id")
    public async getUserById(@requestParam('id') id: number,
        @request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void | User> {
        const start = Date.now();
        try {

            const getUser = await this.userServiceImpl.getUser(id);

            getUser
                ? res.status(200).send(getUser)
                : res.status(404).send(`User with id: ${id} not found`);

        } catch (error) {
            res.status(400).send("Error to find the Users: " + error);
        } finally {
            const responseTimeInMs = Date.now() - start;
            httpRequestTimer.labels(req.method, req.route.path, res.statusCode.toString()).observe(responseTimeInMs);
        }
    }

    @ApiOperationDelete({
        description: "Get users objects",
        summary: "Get user by id",
        parameters: { path: { id: { required: true, type: SwaggerDefinitionConstant.Parameter.Type.NUMBER } } },
        responses: { 202: { description: "Success" }}
    })
    @httpDelete('/:id')
    public async deletUserById(@requestParam('id') id: number,
        @request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void> {
        const start = Date.now();
        try {
            await this.userServiceImpl.delUser(id)

            res.status(200).send("User Deleted")

        } catch (error) {
            res.status(400).send("Error to delete the User: " + error);
        } finally {
            const responseTimeInMs = Date.now() - start;
            httpRequestTimer.labels(req.method, req.route.path, res.statusCode.toString()).observe(responseTimeInMs);
        }
    }

    @ApiOperationPut({
        description: "Update user object",
        summary: "Update user by id",
        parameters : {
            path : {
                id : {
                    description : "Id of User",
                    type : SwaggerDefinitionConstant.Parameter.Type.NUMBER,
                    required : true
                }
            },
            body : {
                description : "Updated user",
                model : "User",
                required : true
            }
        },
        responses: { 200: { description: "Success", type: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "User" } }
    })
    @httpPut('/:id')
    public async updateUser(@requestParam('id') id: number,
        @request() req: Request,
        @response() res: Response,
        @next() next: express.NextFunction): Promise<void> {
        const start = Date.now();
        const user = new User(req.body.num_item, req.body.nome_item);

        try {
            await this.userServiceImpl.changeUser(id, user);

            res.status(200).send("User Changed")

        } catch (error) {
            res.status(400).send("Error to delete the User: " + error);
        } finally {
            const responseTimeInMs = Date.now() - start;
            httpRequestTimer.labels(req.method, req.route.path, res.statusCode.toString()).observe(responseTimeInMs);
        }
    }
}