import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';

const OrderHistoryScreen = () => {
    const { colors } = useTheme();
    const { orders } = useOrders();
    const { addToCart, updateQuantity } = useCart();

    const handleReorder = (order) => {
        // Clear existing cart items first
        order.items.forEach(item => {
            // Add each item from the order to the cart
            // We'll add items one by one to handle quantities properly
            for (let i = 0; i < item.qty; i++) {
                addToCart({
                    ...item,
                    qty: 1 // Add items one at a time to trigger proper quantity updates
                });
            }
        });
        Alert.alert('Success', 'Items have been added to your cart!');
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.date, { color: colors.text }]}>Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</Text>
                    <Text style={[styles.time, { color: colors.text }]}>Time: {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</Text>
                </View>
                <Text style={[styles.status, { color: colors.success, alignSelf: 'flex-start' }]}>{item.status}</Text>
            </View>

            <View style={styles.itemsList}>
                {item.items.map((prod, index) => (
                    <Text key={index} style={[styles.prodText, { color: colors.text }]}>
                        {prod.qty} x {prod.name}
                    </Text>
                ))}
            </View>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={styles.footerLeft}>
                    <Text style={[styles.totalLabel, { color: colors.text }]}>Total Paid:</Text>
                    <Text style={[styles.totalAmount, { color: colors.primary }]}>₹{item.total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.reorderButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleReorder(item)}
                >
                    <Text style={styles.reorderButtonText}>Reorder</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            {orders.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{ color: colors.text }}>No orders placed yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={[styles.list, { paddingBottom: 220 }]}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        paddingBottom: 80, // Increased for more space below
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
    },
    list: { 
        padding: 10,
        paddingBottom: 180, // Extra padding to ensure content isn't hidden behind bottom tabs or camera
    },
    card: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '100%',
        maxWidth: 600, // Max width for larger screens
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    date: { fontSize: 12, opacity: 0.7 },
    time: { fontSize: 12, opacity: 0.7, marginTop: 2 },
    status: { fontWeight: 'bold', fontSize: 12 },
    itemsList: { marginBottom: 10 },
    prodText: { fontSize: 14, marginBottom: 2 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        marginTop: 12,
        borderTopWidth: 1,
        paddingHorizontal: 4,
    },
    footerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    reorderButton: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginLeft: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reorderButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    totalLabel: { 
        fontWeight: '600',
        marginRight: 8,
    },
    totalAmount: { 
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default OrderHistoryScreen;
