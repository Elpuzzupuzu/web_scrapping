import express from "express";
import {
  createRobot,
  getAllRobots,
  getRobotById,
  deleteRobot
} from "../controllers/robot.controller.js";

const router = express.Router();

router.post("/", createRobot);
router.get("/", getAllRobots);
router.get("/:id", getRobotById);
router.delete("/:id", deleteRobot);

export default router;