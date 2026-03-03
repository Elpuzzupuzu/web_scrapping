import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios"; // Asumiendo que aquí tienes configurado axios

// ===============================
// Thunks (Acciones Asíncronas)
// ===============================

// Obtener todos los robots
export const fetchRobots = createAsyncThunk(
  "robots/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/robots");
      return response.data; // Retorna el array de robots
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error al obtener los robots" }
      );
    }
  }
);

// Crear un nuevo robot (con sus selectores)
export const createRobot = createAsyncThunk(
  "robots/create",
  async (robotData, thunkAPI) => {
    try {
      const response = await api.post("/robots", robotData);
      return response.data; // Retorna el robot creado con sus selectores
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error al crear el robot" }
      );
    }
  }
);

// Eliminar un robot
export const deleteRobot = createAsyncThunk(
  "robots/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/robots/${id}`);
      return id; // Retornamos el ID para quitarlo del estado local
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error al eliminar el robot" }
      );
    }
  }
);

// ===============================
// Slice
// ===============================

const robotSlice = createSlice({
  name: "robots",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Robots
      .addCase(fetchRobots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRobots.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRobots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
      })

      // Create Robot
      .addCase(createRobot.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // Agrega el nuevo robot al inicio de la lista
      })
      .addCase(createRobot.rejected, (state, action) => {
        state.error = action.payload.message || action.payload;
      })

      // Delete Robot
      .addCase(deleteRobot.fulfilled, (state, action) => {
        state.items = state.items.filter((robot) => robot.id !== action.payload);
      })
      .addCase(deleteRobot.rejected, (state, action) => {
        state.error = action.payload.message || action.payload;
      });
  },
});

export const { resetError } = robotSlice.actions;
export default robotSlice.reducer;