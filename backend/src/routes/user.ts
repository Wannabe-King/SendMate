import { Router, Request, Response } from "express";
import { z, ZodError } from "zod";
import { accountModel, UserModel } from "../db";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { auth } from "../middleware/auth";

const saltRounds = 3;

export const userRouter = Router();

function randomBalance(): Number {
  return Math.floor(1 + Math.random() * 10000);
}

const userSchema = z.object({
  username: z
    .string()
    .nonempty("Username cannot be empty")
    .email("Invalid username/email"),
  firstName: z.string().nonempty("First Name is required"),
  lastName: z.string().optional(),
  password: z.string().nonempty("Passsword is required"),
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { success } = userSchema.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
      return;
    }
    const userExists = await UserModel.findOne({
      username: req.body.username,
    });
    if (userExists) {
      res.status(411).send({
        message: "User already exists",
      });
      return;
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Creating new user
    const user = await UserModel.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: encryptedPassword,
    });

    // Creating new account for user
    await accountModel.create({
      userId: user._id,
      balance: randomBalance(),
    });

    const userId = user._id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );
    res.send({
      message: "User created successsfully",
      token: token,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(500).send({
        message: e.errors,
      });
      return;
    }
    res.status(500).send({
      message: e,
    });
  }
});

const singInSchema = z.object({
  username: z.string().email().nonempty(),
  password: z.string().nonempty(),
});

userRouter.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { success } = singInSchema.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: "Incorrect inputs",
      });
      return;
    }
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      res.send({
        message: "User does not exists.",
      });
    } else {
      const decodedPassword = await bcrypt.compare(password, user.password);
      if (!decodedPassword) {
        res.status(411).send({
          message: "Invalid Password",
        });
        return;
      } else {
        const userId = user._id;
        const token = jwt.sign(
          {
            userId,
          },
          JWT_SECRET
        );
        res.send({
          message: "Login successful",
          token: token,
        });
      }
    }
  } catch (e) {
    res.status(411).send({
      error: "Error while login",
    });
  }
});

const updateBody = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().optional(),
});

userRouter.put("/", auth, async (req: Request, res: Response) => {
  try {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      res.status(411).send({
        message: "Invalid Input",
      });
    }
    const userId = req.userId;
    await UserModel.updateOne(
      {
        _id: userId,
      },
      req.body
    );
    res.send({
      message: "User Updated successfully",
    });
  } catch (e) {
    res.status(411).send({
      message: "Error while updating user",
      error: e,
    });
  }
});

userRouter.get("/bulk", auth, async (req: Request, res: Response) => {
  const string = req.query.filter || "";
  const users = await UserModel.find({
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
});

userRouter.get("/me", auth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user info",
      error,
    });
  }
});
