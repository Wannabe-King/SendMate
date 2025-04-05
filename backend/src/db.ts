import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGO_URL as string);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  firstName: { type: String, required: true, maxLength: 30, trim: true },
  lastName: { type: String, required: true, maxLength: 30, trim: true },
  password: { type: String, required: true, minLength: 6, trim: true },
});

export const UserModel = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});

export const accountModel = mongoose.model("Account", accountSchema);
