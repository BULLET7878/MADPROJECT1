import React, { createContext, useState, useContext, useEffect } from 'react';
import LocalDB from '../utils/localDatabase';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define loadItems as a function that can be called from outside
    const loadItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const loadedItems = await LocalDB.getItems();
            setItems(loadedItems);
        } catch (err) {
            console.error('Failed to load items:', err);
            setError('Failed to load items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load items on component mount
    useEffect(() => {
        loadItems();
    }, []);

    const addItem = async (newItem) => {
        try {
            const addedItem = await LocalDB.addItem({
                name: newItem.name.trim(),
                price: Number(newItem.price),
                quantity: Number(newItem.quantity),
                unit: newItem.unit || 'kg',
                discount: Number(newItem.discount) || 0,
                image: newItem.image,
            });
            
            // Update local state
            setItems(prev => [...prev, addedItem]);
            
            return addedItem;
        } catch (err) {
            console.error('Failed to add item:', err);
            throw new Error('Failed to add item');
        }
    };

    const deleteItem = async (id) => {
        try {
            await LocalDB.deleteItem(id);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Failed to delete item:', err);
            throw new Error('Failed to delete item');
        }
    };

    const updateItem = async (id, updatedItem) => {
        try {
            const updated = await LocalDB.updateItem(id, {
                name: updatedItem.name.trim(),
                price: Number(updatedItem.price),
                quantity: Number(updatedItem.quantity),
                unit: updatedItem.unit || 'kg',
                discount: Number(updatedItem.discount) || 0,
                image: updatedItem.image,
            });
            
            // Update local state
            setItems(prev => 
                prev.map(item => 
                    item.id === id 
                        ? { ...item, ...updated } 
                        : item
                )
            );
            
            return updated;
        } catch (err) {
            console.error('Failed to update item:', err);
            throw new Error('Failed to update item');
        }
    };

    const getItemById = (id) => {
        return items.find(item => item.id === id);
    };

    return (
        <InventoryContext.Provider value={{
            items,
            loading,
            error,
            addItem,
            deleteItem,
            updateItem,
            getItemById,
            loadItems
        }}>
            {children}
        </InventoryContext.Provider>
    );
};
