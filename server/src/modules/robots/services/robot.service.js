import {
  createRobotRepo,
  insertSelectorsRepo,
  getAllRobotsRepo,
  getRobotByIdRepo,
  deleteRobotRepo
} from "../repositories/robot.repository.js";

export const createRobotService = async (payload) => {

  if (!payload.name || !payload.url || !payload.selectors?.length) {
    throw new Error("Datos incompletos");
  }

  // Crear robot
  const robot = await createRobotRepo(payload);

  // Preparar selectores
  const selectorsFormatted = payload.selectors.map(sel => ({
    robot_id: robot.id,
    field_name: sel.field_name,
    css_selector: sel.css_selector
  }));

  // Insertar selectores
  await insertSelectorsRepo(selectorsFormatted);

  return await getRobotByIdRepo(robot.id);
};

export const getAllRobotsService = async () => {
  return await getAllRobotsRepo();
};

export const getRobotByIdService = async (id) => {
  return await getRobotByIdRepo(id);
};

export const deleteRobotService = async (id) => {
  return await deleteRobotRepo(id);
};