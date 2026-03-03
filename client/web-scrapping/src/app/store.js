import { configureStore } from "@reduxjs/toolkit";
import robotReducer from "../features/robots/robotSlice";
import executionReducer from "../features/exucteRobots/executeRobotsSlice"; // Importamos el nuevo slice

export const store = configureStore({
  reducer: {
    robots: robotReducer,       // Gestiona la DB de robots
    executions: executionReducer // Gestiona las corridas del scraper
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;