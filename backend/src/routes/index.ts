import { Router } from "express";
import { userRouter } from "./user";
import { accountRouter } from "./account";

export const homeRouter = Router();

homeRouter.use("/user", userRouter);

homeRouter.use('/account', accountRouter);