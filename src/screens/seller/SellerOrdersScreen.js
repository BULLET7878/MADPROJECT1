import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOrders } from '../../context/OrderContext';

const SellerOrdersScreen = () => {
    const { colors } = useTheme();
    const { orders } = useOrders();

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

            <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>Address:</Text>
                <Text style={[styles.detailValue, { color: colors.text, flex: 1 }]} numberOfLines={2} ellipsizeMode="tail">{item.address || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>Delivery Charge:</Text>
                <Text style={[styles.detailValue, { color: colors.primary }]}>₹{item.deliveryCharge ? item.deliveryCharge.toFixed(2) : '0.00'}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>Payment:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{item.paymentMethod === 'cod' ? 'Cash on Delivery' : (item.paymentMethod || '-')}</Text>
            </View>

            <View style={[styles.footer, { borderTopColor: colors.border }]}> 
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total Paid:</Text>
                <Text style={[styles.totalAmount, { color: colors.primary }]}>₹{item.total.toFixed(2)}</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {orders.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{ color: colors.text }}>No orders placed yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 15 },
    card: { borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    date: { fontSize: 12, opacity: 0.7 },
    time: { fontSize: 12, opacity: 0.7, marginTop: 2 },
    status: { fontWeight: 'bold', fontSize: 12 },
    itemsList: { marginBottom: 10 },
    prodText: { fontSize: 14, marginBottom: 2 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1 },
    totalLabel: { fontWeight: '600' },
    totalAmount: { fontWeight: 'bold' },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
    detailLabel: { fontSize: 13, fontWeight: '600', minWidth: 110 },
    detailValue: { fontSize: 13, flexShrink: 1 },
});

export default SellerOrdersScreen;
