"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
mongoose_1.default.connect(process.env.MONGO_URL);
const userSchema = new mongoose_1.default.Schema({
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
exports.UserModel = mongoose_1.default.model("User", userSchema);
const accountSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true },
});
exports.accountModel = mongoose_1.default.model("Account", accountSchema);
