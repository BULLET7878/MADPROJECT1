import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const SellerHomeScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { 
        items, 
        loading, 
        error,
        deleteItem, 
        updateItem,
        addItem
    } = useInventory();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        // The InventoryProvider will handle refreshing the items
        // We just need to wait a bit to show the refresh indicator
        setTimeout(() => setRefreshing(false), 1000);
    };

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialIcons name="error-outline" size={50} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
                <TouchableOpacity 
                    style={[styles.retryButton, { backgroundColor: colors.primary }]}
                    onPress={onRefresh}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleDelete = async (id) => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    onPress: async () => {
                        try {
                            await deleteItem(id);
                        } catch (error) {
                            console.error('Error deleting item:', error);
                            Alert.alert('Error', 'Failed to delete item');
                        }
                    }, 
                    style: "destructive" 
                }
            ]
        );
    };

    const handleEdit = (item) => {
        navigation.navigate('EditItem', { itemId: item.id });
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.price, { color: colors.primary }]}>₹{item.price} / {item.unit}</Text>
                <Text style={[styles.stock, { color: colors.text }]}>Stock: {item.quantity} {item.unit}</Text>
                {item.discount > 0 && (
                    <Text style={styles.discount}>{item.discount}% Off</Text>
                )}
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.primary, marginRight: 8 }]}
                    onPress={() => handleEdit(item)}
                >
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.danger }]}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: colors.success }]}
                        onPress={() => navigation.navigate('AddItem')}
                    >
                        <Text style={styles.btnText}>+ Add Item</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: colors.primary, marginLeft: 10 }]}
                        onPress={() => navigation.navigate('SellerOrders')}
                    >
                        <Text style={styles.btnText}>Order History</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="inventory" size={60} color={colors.border} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>No items in your inventory</Text>
                    <Text style={[styles.emptySubtext, { color: colors.text }]}>
                        Add your first product to start selling
                    </Text>
                    <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: colors.primary, marginTop: 20 }]}
                        onPress={() => navigation.navigate('AddItem')}
                    >
                        <MaterialIcons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.btnText}>Add Your First Item</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                    ListFooterComponent={
                        <TouchableOpacity
                            style={[styles.addAnotherBtn, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate('AddItem')}
                        >
                            <MaterialIcons name="add" size={18} color="#fff" />
                            <Text style={styles.addAnotherText}>Add Another Item</Text>
                        </TouchableOpacity>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorText: {
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
        marginHorizontal: 24,
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    headerButtons: { flexDirection: 'row', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    addBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    list: { padding: 10 },
    card: {
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 4,
        backgroundColor: '#ccc',
    },
    details: {
        flex: 1,
        marginLeft: 10,
    },
    name: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
    price: { fontSize: 14, fontWeight: '600' },
    stock: { fontSize: 12, marginTop: 2, opacity: 0.8 },
    discount: { color: 'green', fontSize: 12, marginTop: 2 },
    actions: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
        marginBottom: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.7,
    },
    btnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
    addAnotherBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 10,
        alignSelf: 'center',
        minWidth: 160,
    },
    addAnotherText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 6,
    },
});

export default SellerHomeScreen;
