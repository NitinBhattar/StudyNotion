// Import
import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    user: null
};

// Slice
const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        }
    }
});

// Export
export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;
