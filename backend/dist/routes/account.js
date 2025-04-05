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
exports.accountRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = require("../db");
const mongoose_1 = __importDefault(require("mongoose"));
exports.accountRouter = (0, express_1.Router)();
exports.accountRouter.get("/balance", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield db_1.accountModel
            .findOne({ userId: req.userId })
            .populate("userId", "firstName lastName");
        if (!account) {
            res.status(411).send({
                message: "Account does not exist",
            });
            return;
        }
        res.send({
            account,
        });
    }
    catch (e) {
        res.status(400).send({
            message: "There was an error getting the balance.",
        });
    }
}));
exports.accountRouter.post("/transfer", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    const bodyData = req.body;
    const reciverId = bodyData.to;
    const amount = bodyData.amount;
    try {
        session.startTransaction();
        const senderAccount = yield db_1.accountModel.findOne({
            userId: req.userId,
        });
        if (!senderAccount) {
            session.abortTransaction();
            res.status(400).send({
                message: "Sender account does not exists",
            });
            return;
        }
        else {
            if (senderAccount.balance < amount) {
                session.abortTransaction();
                res.status(400).send({
                    message: "Insufficient Balance",
                });
            }
            const reciverAccount = yield db_1.accountModel.findOne({
                userId: reciverId,
            });
            if (!reciverAccount) {
                session.abortTransaction();
                res.status(400).send({
                    message: "Reciver account does not exists",
                });
                return;
            }
            yield db_1.accountModel.updateOne({ userId: req.userId }, {
                $inc: { balance: -amount },
            });
            yield db_1.accountModel.updateOne({ userId: reciverId }, {
                $inc: { balance: amount },
            });
            session.commitTransaction();
            res.send({
                message: "Transfer Successful",
            });
        }
    }
    catch (e) {
        yield session.abortTransaction();
        res.status(400).send({
            message: "Error while transfer",
            error: e,
        });
    }
}));
