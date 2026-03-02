import express from "express";
import robotRoutes from "../src/modules/robots/routes/robot.routes.js";

const app = express();

app.use(express.json());

app.use("/api/robots", robotRoutes);

export default app;