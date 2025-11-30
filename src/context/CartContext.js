
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [coupon, setCoupon] = useState(null);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const applyCoupon = (code) => {
        if (code === 'SAVE10') {
            setCoupon({ code, type: 'percent', value: 10 });
            return true;
        } else if (code === 'SAVE50') {
            setCoupon({ code, type: 'flat', value: 50 });
            return true;
        }
        return false;
    };

    const clearCoupon = () => setCoupon(null);

    const getTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        let discountAmount = 0;

        if (coupon) {
            if (coupon.type === 'percent') {
                discountAmount = (subtotal * coupon.value) / 100;
            } else {
                discountAmount = coupon.value;
            }
        }

        // Ensure total doesn't go below 0
        const total = Math.max(0, subtotal - discountAmount);

        return { subtotal, discountAmount, total };
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            applyCoupon,
            clearCoupon,
            coupon,
            getTotals
        }}>
            {children}
        </CartContext.Provider>
    );
};
