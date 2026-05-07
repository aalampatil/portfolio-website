import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT,
    ],
  }),
);

app.get("/", (req, res) => {
  res.json("server up and runnig");
});

import commitDetailRouter from "./routes/commitDetail.routes.js";
import { featuresRouter } from "./routes/features.routes.js";
import { connectDB } from "./db/db.js";

app.use("/api", commitDetailRouter);
app.use("/api/features", featuresRouter);



connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("index.js connectDB on error", error);
    });

    app.listen(port, () => {
      console.log(`server is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("fileName - index.js connectDb catch statement ", error);
  });
