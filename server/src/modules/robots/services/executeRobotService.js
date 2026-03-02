// executeRobotService.js

//// import para acceder a los robots creados en la DB
import { getRobotByIdRepo } from "../repositories/robot.repository.js";

//// imports propios para la ejecución de los robots
import {
  createExecutionRepo,
  updateExecutionStatusRepo,
  insertExecutionResultsRepo
} from "../repositories/execution.repository.js";

import { runScraperPlaywright } from "../../../utils/scraperPlaywright.js";

export const executeRobotService = async (robotId) => {
  // Obtener robot con selectores
  const robot = await getRobotByIdRepo(robotId);
  if (!robot) throw new Error("Robot no encontrado");

  // Crear ejecución
  const execution = await createExecutionRepo(robot.id);

  try {
    // Scraping con Playwright
    const scrapedData = await runScraperPlaywright(robot);

    // Preparar resultados para la DB
    const resultsToInsert = [];
    Object.entries(scrapedData).forEach(([field, values]) => {
      (values || []).forEach(value => {
        resultsToInsert.push({
          execution_id: execution.id,
          field_name: field,
          value
        });
      });
    });

    // Insertar resultados en la DB
    await insertExecutionResultsRepo(resultsToInsert);

    // Actualizar estado a 'success'
    await updateExecutionStatusRepo(execution.id, "success");

    // Opcional: log para depuración
    console.log(`Robot "${robot.name}" ejecutado. Resultados: ${resultsToInsert.length}`);

    // Devolver resultados como array de objetos { field_name, value }
    return resultsToInsert;

  } catch (error) {
    // Actualizar estado a 'failed' si hay error
    await updateExecutionStatusRepo(execution.id, "failed");
    throw error;
  }
};