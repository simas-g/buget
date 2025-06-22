import { configureStore, createSlice } from "@reduxjs/toolkit";
const initialState = {
  userId: null,
  sessionId: null,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.userId = action.payload.userId;
            state.sessionId = action.payload.sessionId;
        },
    }
})
const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});
export default store
export const userActions = userSlice.actions
