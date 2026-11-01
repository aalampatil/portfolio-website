import {Router} from "express"
import { updateVisitorCount , getVisitorCount} from "../controllers/features.controllers.js";


export const featuresRouter = Router();

featuresRouter.route("/update-visitor-count").post(updateVisitorCount)
featuresRouter.route("/get-visitor-count").get(getVisitorCount)





