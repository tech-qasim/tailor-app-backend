import { Router } from "express";
import {
  registerTailor,
  loginTailor,
  logOutTailor,
  getCurrentTailor,
} from "../controllers/tailor.controller.js";
import { verifyJWT } from "../middlewares/tailor.auth.middleware.js";
import { upload } from "../middlewares/multer.middlware.js";
const router = Router();

router.route("/register-tailor").post(upload.single("avatar"), registerTailor);
router.route("/login-tailor").post(loginTailor);
router.route("/get-current-tailor").get(verifyJWT, getCurrentTailor);
router.route("/logout").post(verifyJWT, logOutTailor);

export default router;
