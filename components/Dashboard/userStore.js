import { configureStore, createSlice } from "@reduxjs/toolkit";
const initialState = {
  userId: null,
  sessionId: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.sessionId = action.payload.sessionId;
    },
  },
});
const summarySlice = createSlice({
  name: "summary",
  initialState: {},
  reducers: {
    setSummary(state, action) {
      return {
        prevMonth: action.payload.lastSummary,
        current: action.payload.summary,
      };
    },
  },
});
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    summary: summarySlice.reducer,
  },
});
export default store;
export const userActions = userSlice.actions;
export const summaryActions = summarySlice.actions;
