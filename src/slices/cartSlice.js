// Import
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    // After closing the browser, totalItems stays in local storage
    cart: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [],
    // Total amount
    total: localStorage.getItem("total")
        ? JSON.parse(localStorage.getItem("total"))
        : 0,
    // No. of items
    totalItems: localStorage.getItem("totalItems")
        ? JSON.parse(localStorage.getItem("totalItems"))
        : 0
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            const course = action.payload;

            // Already in cart
            const index = state.cart.findIndex((item) => item._id === course._id);

            if (index >= 0) {
                // If the course is already in the cart, do not modify the quantity
                toast.error("Course already in cart");
                return;
            }

            // Add to cart
            state.cart.push(course);
            state.totalItems++;
            state.total += course.price;

            // Update to localstorage
            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("total", JSON.stringify(state.total));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

            // Show toast
            toast.success("Course added to cart");
        },
        removeFromCart: (state, action) => {
            const courseId = action.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);

            if (index >= 0) {
                // If the course is found in the cart, remove it
                state.totalItems--;
                state.total -= state.cart[index].price;
                state.cart.splice(index, 1);

                // Update to localstorage
                localStorage.setItem("cart", JSON.stringify(state.cart));
                localStorage.setItem("total", JSON.stringify(state.total));
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

                // Show toast
                toast.success("Course removed from cart");
            }
        },
        resetCart: (state) => {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;

            // Update to localstorage
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        }
    }
});

// Export
export const {addToCart, removeFromCart, resetCart} = cartSlice.actions;
export default cartSlice.reducer;
