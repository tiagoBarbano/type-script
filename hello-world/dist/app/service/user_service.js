"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../schemas/User");
const repository_1 = require("../repository/repository");
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const u = new User_1.User(req.body.num_item, req.body.nome_item);
    const uu = yield (0, repository_1.insertUser)(u.num_item, u.nome_item);
    console.log(uu);
    res.send("User Created");
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, repository_1.getAllUser)());
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, repository_1.getUser)(req.params.id));
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, repository_1.deleteUser)(req.params.id);
    res.send("Deleted Users");
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, repository_1.updateUser)(req.params.id, req.body.num_item, req.body.nome_item);
    res.send("Updated Users");
}));
exports.default = router;
