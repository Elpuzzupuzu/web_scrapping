

import express from "express";
import {
  createRobot,
  getAllRobots,
  getRobotById,
  deleteRobot
} from "../controllers/robot.controller.js";

import { executeRobotController } from "../controllers/execute.controller.js";

const router = express.Router();

// 🚀 CRUD Robots
router.post("/robots", createRobot);          // Crear robot
router.get("/robots", getAllRobots);         // Listar todos
router.get("/robots/:id", getRobotById);     // Obtener uno con selectores
router.delete("/robots/:id", deleteRobot);   // Eliminar robot

// 🖥 Ejecutar robot (Playwright scraping)
router.get("/:id/execute", executeRobotController);
export default router;