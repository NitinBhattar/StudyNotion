// Import
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // After closing the browser, token stays in local storage
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setToken(state, value) {
            state.token = value.payload;
        }
    }
});

// Export
export const {setToken} = authSlice.actions;
export default authSlice.reducer;
