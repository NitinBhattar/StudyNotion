// Import
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js";
import profileReducer from "../slices/profileSlice.js";
import cartReducer from "../slices/cartSlice.js";

// Configuration
const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer
});

// Export
export default rootReducer;
