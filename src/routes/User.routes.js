import { Router } from "express";
import { registerUser } from "../controllers/User.controllers.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifedJWT } from "../middlewares/Auth.middleware.js";
const router =Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(verifedJWT,logout);
export default router