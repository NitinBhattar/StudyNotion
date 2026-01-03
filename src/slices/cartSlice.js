// Import
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    // After closing the browser, totalItems stays in local storage
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        setTotalItems(state, value) {
            state.totalItems = value.payload;
        },
        // Add to Cart
    }
});

// Export
export const {setTotalItems} = cartSlice.actions;
export default cartSlice.reducer;
