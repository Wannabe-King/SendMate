"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const auth = (req, res, next) => {
    const headers = req.headers.authorization;
    if (!headers || !headers.startsWith("Bearer ")) {
        res.status(411).send({
            message: "Unauthorized user please try again.",
        });
        return;
    }
    const token = headers.split(" ")[1];
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    }
    catch (e) {
        res.status(411).send({
            message: "Unauthorized user please try again.",
            error: e,
        });
    }
};
exports.auth = auth;
