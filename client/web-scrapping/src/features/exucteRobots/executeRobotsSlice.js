import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const executeRobot = createAsyncThunk(
  "executions/execute",
  async (robotId, thunkAPI) => {
    try {
      const response = await api.get(`/execute/${robotId}/execute`);
      return { robotId, results: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error al ejecutar el scraper" }
      );
    }
  }
);

const executionSlice = createSlice({
  name: "executions",
  initialState: {
    results: {}, // Guardamos resultados por ID de robot: { [robotId]: [...] }
    executing: {}, // Status de carga por robot: { [robotId]: true/false }
    error: null,
  },
  reducers: {
    clearResults: (state, action) => {
      const robotId = action.payload;
      if (robotId) delete state.results[robotId];
      else state.results = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeRobot.pending, (state, action) => {
        state.executing[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(executeRobot.fulfilled, (state, action) => {
        const { robotId, results } = action.payload;
        state.executing[robotId] = false;
        state.results[robotId] = results;
      })
      .addCase(executeRobot.rejected, (state, action) => {
        state.executing[action.meta.arg] = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearResults } = executionSlice.actions;
export default executionSlice.reducer;