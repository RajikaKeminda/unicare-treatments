import { Router } from "express";

import {
  signUp,
  signIn,
  verifyUser,
  checkUniqueUserName,
  getAllPartially,
  getPartially,
  updatePartially,
  refreshToken,
} from "../controllers/userController.ts";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authenticate.ts";

const router = Router();

router.route("/profile/sign-up").post(signUp);
router.route("/profile/sign-in").post(signIn);
router.route("/profile/verify-user").post(verifyUser);
router.route("/profile/check-unique/:username").get(checkUniqueUserName);

router.route("/refreshToken").post(refreshToken);
router
  .route("/")
  .get(authenticateToken, authorizeRole(["admin"]), getAllPartially);

router.route("/:id").get(getPartially).put(updatePartially);

export default router;
