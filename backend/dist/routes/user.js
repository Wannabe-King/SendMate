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
exports.userRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const auth_1 = require("../middleware/auth");
const saltRounds = 3;
exports.userRouter = (0, express_1.Router)();
function randomBalance() {
    return Math.floor(1 + Math.random() * 10000);
}
const userSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .nonempty("Username cannot be empty")
        .email("Invalid username/email"),
    firstName: zod_1.z.string().nonempty("First Name is required"),
    lastName: zod_1.z.string().optional(),
    password: zod_1.z.string().nonempty("Passsword is required"),
});
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = userSchema.safeParse(req.body);
        if (!success) {
            res.status(411).json({
                message: "Email already taken / Incorrect inputs",
            });
            return;
        }
        const userExists = yield db_1.UserModel.findOne({
            username: req.body.username,
        });
        if (userExists) {
            res.status(411).send({
                message: "User already exists",
            });
            return;
        }
        const encryptedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
        // Creating new user
        const user = yield db_1.UserModel.create({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: encryptedPassword,
        });
        // Creating new account for user
        yield db_1.accountModel.create({
            userId: user._id,
            balance: randomBalance(),
        });
        const userId = user._id;
        const token = jsonwebtoken_1.default.sign({
            userId,
        }, config_1.JWT_SECRET);
        res.send({
            message: "User created successsfully",
            token: token,
        });
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            res.status(500).send({
                message: e.errors,
            });
            return;
        }
        res.status(500).send({
            message: e,
        });
    }
}));
const singInSchema = zod_1.z.object({
    username: zod_1.z.string().email().nonempty(),
    password: zod_1.z.string().nonempty(),
});
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const { success } = singInSchema.safeParse(req.body);
        if (!success) {
            res.status(411).json({
                message: "Incorrect inputs",
            });
            return;
        }
        const user = yield db_1.UserModel.findOne({
            username,
        });
        if (!user) {
            res.send({
                message: "User does not exists.",
            });
        }
        else {
            const decodedPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!decodedPassword) {
                res.status(411).send({
                    message: "Invalid Password",
                });
                return;
            }
            else {
                const userId = user._id;
                const token = jsonwebtoken_1.default.sign({
                    userId,
                }, config_1.JWT_SECRET);
                res.send({
                    message: "Login successful",
                    token: token,
                });
            }
        }
    }
    catch (e) {
        res.status(411).send({
            error: "Error while login",
        });
    }
}));
const updateBody = zod_1.z.object({
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
});
exports.userRouter.put("/", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = updateBody.safeParse(req.body);
        if (!success) {
            res.status(411).send({
                message: "Invalid Input",
            });
        }
        const userId = req.userId;
        yield db_1.UserModel.updateOne({
            _id: userId,
        }, req.body);
        res.send({
            message: "User Updated successfully",
        });
    }
    catch (e) {
        res.status(411).send({
            message: "Error while updating user",
            error: e,
        });
    }
}));
exports.userRouter.get("/bulk", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const string = req.query.filter || "";
    const users = yield db_1.UserModel.find({
        $or: [
            {
                firstName: {
                    $regex: string,
                },
            },
            {
                lastName: {
                    $regex: string,
                },
            },
        ],
    });
    res.send({
        users: users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })),
    });
}));
exports.userRouter.get("/me", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield db_1.UserModel.findById(userId);
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            message: "success",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch user info",
            error,
        });
    }
}));
