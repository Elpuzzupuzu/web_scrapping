import express from "express";
import robotRoutes from "../src/modules/robots/routes/robot.routes.js";
import executeRobotsRoutes from "../src/modules/robots/routes/execute.robot.routes.js"
const app = express();

app.use(express.json());

app.use("/api/robots", robotRoutes);
app.use("/api/execute/robots", executeRobotsRoutes);
export default app;