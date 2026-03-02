import { executeRobotService } from "../services/executeRobotService.js";

export const executeRobotController = async (req, res) => {
  try {
    const data = await executeRobotService(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};