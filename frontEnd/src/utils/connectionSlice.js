import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: [],

  reducers: {
    addConnection: (state, action) => {
      // Ensure we always return a valid array
      const payload = action.payload;
      if (Array.isArray(payload)) {
        return payload.filter((connection) => connection && connection._id); // Filter out invalid connections
      }
      return state; // Keep current state if payload is invalid
    },
    removeConnection: (state, action) => {
      // Remove specific connection by ID, or clear all if no ID provided
      if (action.payload) {
        return state.filter((connection) => connection._id !== action.payload);
      }
      return []; // Return empty array, not null
    },
  },
});

export const { addConnection, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
