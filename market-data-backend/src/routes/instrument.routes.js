import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { subscribeToInstrument, unsubscribeFromInstrument, } from "../controllers/instrument.controller.js";

const router = Router();

// Protected route: requires valid JWT
router.post("/subscribe", verifyToken, subscribeToInstrument);
router.post("/unsubscribe", verifyToken, unsubscribeFromInstrument); 

export default router;
