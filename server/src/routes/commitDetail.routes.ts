import { Router } from "express";
import { getCommit } from "../controllers/commit.controller.js";

const commitDetailRouter = Router()

commitDetailRouter.route("/commit-details").get(getCommit)

export default commitDetailRouter