"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRouter = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const account_1 = require("./account");
exports.homeRouter = (0, express_1.Router)();
exports.homeRouter.use("/user", user_1.userRouter);
exports.homeRouter.use('/account', account_1.accountRouter);
