import express from "express";
import { homeRouter } from "./routes/index";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", homeRouter);

app.listen(3000, () => {
  "server is up";
});
