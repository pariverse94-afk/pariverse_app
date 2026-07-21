import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import inviteRouter from "./invite";
import deleteAccountRouter from "./delete-account";
import profileRouter from "./profile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
router.use(inviteRouter);
router.use(deleteAccountRouter);
router.use(profileRouter);

export default router;
