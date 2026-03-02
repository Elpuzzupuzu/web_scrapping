import { supabase } from "../../../config/supabaseConfig.js";

/* Crear robot */
export const createRobotRepo = async (robotData) => {
  const { data, error } = await supabase
    .from("robots")
    .insert([{
      name: robotData.name,
      url: robotData.url,
      cron_expression: robotData.cron_expression || null
    }])
    .select()
    .single();

  if (error) throw error;

  return data;
};

/* Insertar selectores */
export const insertSelectorsRepo = async (selectors) => {
  const { error } = await supabase
    .from("selectors")
    .insert(selectors);

  if (error) throw error;
};

/* Obtener todos */
export const getAllRobotsRepo = async () => {
  const { data, error } = await supabase
    .from("robots")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

/* Obtener uno con selectores */
export const getRobotByIdRepo = async (id) => {
  const { data, error } = await supabase
    .from("robots")
    .select(`
      *,
      selectors (*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

/* Eliminar */
export const deleteRobotRepo = async (id) => {
  const { error } = await supabase
    .from("robots")
    .delete()
    .eq("id", id);

  if (error) throw error;
};