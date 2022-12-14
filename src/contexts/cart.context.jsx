import { createContext, useReducer } from "react";
import { createAction } from "../utils/reducer/reducer.utils";

const addToCartHelper = (cartItems, productToAdd) => {
    const ifItemExists = cartItems.find((i) => i.id === productToAdd.id);
    if (ifItemExists) {
        return cartItems.map((i) =>
            i.id === productToAdd.id ? { ...i, count: i.count + 1 } : i
        );
    }
    return [...cartItems, { ...productToAdd, count: 1 }];
};

const removeCartHelper = (cartItems, productToRemove) => {
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === productToRemove.id
    );
    if (existingCartItem.count === 1) {
        return cartItems.filter(
            (cartItem) => cartItem.id !== productToRemove.id
        );
    }
    return cartItems.map((cartItem) =>
        cartItem.id === productToRemove.id
            ? { ...cartItem, count: cartItem.count - 1 }
            : cartItem
    );
};

export const CART_ACTION_TYPES = {
    SET_CART_ITEMS: "SET_CART_ITEMS",
    SET_CART_STATUS: "SET_CART_STATUS",
};

const INITIAL_STATE = {
    cartStatus: false,
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
};

const cartReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case CART_ACTION_TYPES.SET_CART_ITEMS:
            return {
                ...state,
                ...payload,
            };
        case CART_ACTION_TYPES.SET_CART_STATUS:
            return {
                ...state,
                ...payload,
            };
        default:
            throw new Error(`Unhandled type ${type} in the userReducer !`);
    }
};

const clearCartItem = (cartItems, cartItemToClear) => {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);
};

export const CartContext = createContext({
    cartStatus: false,
    setCartStatus: () => {},
    cartItems: [],
    addItemToCart: () => {},
    cartCount: 0,
    removeItemFromCart: () => {},
    removeWholeItem: () => {},
    cartTotal: 0,
});

export const CartProvider = ({ children }) => {
    const [{ cartStatus, cartItems, cartCount, cartTotal }, dispatch] =
        useReducer(cartReducer, INITIAL_STATE);

    const updateCartItemsReducer = (cartItems) => {
        const newCartCount = cartItems.reduce(
            (total, cartItems) => total + cartItems.count,
            0
        );
        const newCartTotal = cartItems.reduce(
            (total, cartItem) => total + cartItem.count * cartItem.price,
            0
        );
        dispatch(
            createAction(CART_ACTION_TYPES.SET_CART_ITEMS, {
                cartItems,
                cartTotal: newCartTotal,
                cartCount: newCartCount,
            })
        );
    };

    const setCartStatus = (status) => {
        dispatch(
            createAction(CART_ACTION_TYPES.SET_CART_STATUS, {
                cartStatus: status,
            })
        );
    };

    const addItemToCart = (productToAdd) => {
        const newCartItems = addToCartHelper(cartItems, productToAdd);
        updateCartItemsReducer(newCartItems);
    };

    const removeItemFromCart = (productToRemove) => {
        const newCartItems = removeCartHelper(cartItems, productToRemove);
        updateCartItemsReducer(newCartItems);
    };

    const removeWholeItem = (cartItemToClear) => {
        const newCartItems = clearCartItem(cartItems, cartItemToClear);
        updateCartItemsReducer(newCartItems);
    };

    const value = {
        cartStatus,
        setCartStatus,
        cartItems,
        addItemToCart,
        removeItemFromCart,
        removeWholeItem,
        cartCount,
        cartTotal,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};
