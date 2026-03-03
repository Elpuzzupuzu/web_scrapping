import express from "express";
import cors from "cors"; // <-- importar cors
import robotRoutes from "../src/modules/robots/routes/robot.routes.js";
import executeRobotsRoutes from "../src/modules/robots/routes/execute.robot.routes.js";

const app = express();

// Configurar CORS
app.use(cors({
  origin: "http://localhost:5173", // permite solicitudes solo desde este origen
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true // si planeas usar cookies o autenticación
}));

app.use(express.json());

app.use("/api/robots", robotRoutes);
app.use("/api/execute/robots", executeRobotsRoutes);

export default app;