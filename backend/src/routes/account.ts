import { Router } from "express";
import { auth } from "../middleware/auth";
import { accountModel } from "../db";
import mongoose from "mongoose";

export const accountRouter = Router();

accountRouter.get("/balance", auth, async (req, res) => {
  try {
    const account = await accountModel
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
  } catch (e) {
    res.status(400).send({
      message: "There was an error getting the balance.",
    });
  }
});

accountRouter.post("/transfer", auth, async (req, res) => {
  const session = await mongoose.startSession();
  const bodyData = req.body;
  const reciverId = bodyData.to;
  const amount = bodyData.amount;
  try {
    session.startTransaction();
    const senderAccount = await accountModel.findOne({
      userId: req.userId,
    });
    if (!senderAccount) {
      session.abortTransaction();
      res.status(400).send({
        message: "Sender account does not exists",
      });
      return;
    } else {
      if (senderAccount.balance < amount) {
        session.abortTransaction();
        res.status(400).send({
          message: "Insufficient Balance",
        });
      }
      const reciverAccount = await accountModel.findOne({
        userId: reciverId,
      });
      if (!reciverAccount) {
        session.abortTransaction();
        res.status(400).send({
          message: "Reciver account does not exists",
        });
        return;
      }

      await accountModel.updateOne(
        { userId: req.userId },
        {
          $inc: { balance: -amount },
        }
      );
      await accountModel.updateOne(
        { userId: reciverId },
        {
          $inc: { balance: amount },
        }
      );
      session.commitTransaction();
      res.send({
        message: "Transfer Successful",
      });
    }
  } catch (e) {
    await session.abortTransaction();
    res.status(400).send({
      message: "Error while transfer",
      error: e,
    });
  }
});
