import { supabase } from "../../../config/supabaseConfig.js";

/* Crear ejecución */
export const createExecutionRepo = async (robotId) => {
  const { data, error } = await supabase
    .from("executions")
    .insert([{ robot_id: robotId, status: "running" }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/* Actualizar status de ejecución */
export const updateExecutionStatusRepo = async (executionId, status) => {
  const { error } = await supabase
    .from("executions")
    .update({ status })
    .eq("id", executionId);

  if (error) throw error;
};

/* Insertar resultados de ejecución */
export const insertExecutionResultsRepo = async (results) => {
  const { error } = await supabase
    .from("execution_results")
    .insert(results);

  if (error) throw error;
};

/* Obtener ejecución con resultados */
export const getExecutionByIdRepo = async (id) => {
  const { data, error } = await supabase
    .from("executions")
    .select(`
      *,
      execution_results (*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};