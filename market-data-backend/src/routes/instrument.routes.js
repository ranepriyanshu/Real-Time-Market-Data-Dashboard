import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  subscribeToInstrument,
  unsubscribeFromInstrument,
  getSubscriptions,
} from "../controllers/instrument.controller.js";

const router = Router();


router.post("/subscribe", verifyToken, subscribeToInstrument);


router.post("/unsubscribe", verifyToken, unsubscribeFromInstrument);

router.get("/subscriptions", verifyToken, getSubscriptions);

export default router;
