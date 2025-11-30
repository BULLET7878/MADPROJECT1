
import React, { createContext, useState, useContext, useEffect } from 'react';
import LocalDB from '../utils/localDatabase';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load orders on component mount
    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const loadedOrders = await LocalDB.getOrders();
            setOrders(loadedOrders);
        } catch (err) {
            console.error('Failed to load orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const addOrder = async (orderData) => {
        try {
            const newOrder = await LocalDB.addOrder({
                items: orderData.items || [],
                total: orderData.total || 0,
                discount: orderData.discount || 0,
                userId: orderData.userId || 'customer',
                status: 'Placed',
                notes: orderData.notes || '',
            });

            setOrders(prev => [newOrder, ...prev]);
            return newOrder;
        } catch (err) {
            console.error('Failed to add order:', err);
            throw new Error('Failed to add order');
        }
    };

    const updateOrder = async (orderId, updatedData) => {
        try {
            const updated = await LocalDB.updateOrder(orderId, updatedData);
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? updated : order
                )
            );
            return updated;
        } catch (err) {
            console.error('Failed to update order:', err);
            throw new Error('Failed to update order');
        }
    };

    const getOrderHistory = async (userId) => {
        try {
            return await LocalDB.getOrdersByUser(userId || 'customer');
        } catch (err) {
            console.error('Failed to get order history:', err);
            return [];
        }
    };

    return (
        <OrderContext.Provider value={{ orders, loading, error, addOrder, updateOrder, getOrderHistory, loadOrders }}>
            {children}
        </OrderContext.Provider>
    );
};
