import {
  createRobotService,
  getAllRobotsService,
  getRobotByIdService,
  deleteRobotService
} from "../services/robot.service.js";

export const createRobot = async (req, res) => {
  try {
    const robot = await createRobotService(req.body);
    res.status(201).json(robot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllRobots = async (req, res) => {
  try {
    const robots = await getAllRobotsService();
    res.json(robots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRobotById = async (req, res) => {
  try {
    const robot = await getRobotByIdService(req.params.id);
    res.json(robot);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteRobot = async (req, res) => {
  try {
    await deleteRobotService(req.params.id);
    res.json({ message: "Robot eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};