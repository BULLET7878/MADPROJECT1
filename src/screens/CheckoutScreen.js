import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

// Fixed delivery charge (can be made configurable later)
const DELIVERY_CHARGE = 30;

const CheckoutScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { getTotals, cart } = useCart();
    const { addOrder } = useOrders();
    const { total } = getTotals();

    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handlePlaceOrder = () => {
        if (!address.trim()) {
            Alert.alert('Error', 'Please enter delivery address');
            return;
        }
        const finalTotal = total + DELIVERY_CHARGE;
        addOrder({
            items: cart,
            total: finalTotal,
            deliveryCharge: DELIVERY_CHARGE,
            address,
            paymentMethod,
        });
        Alert.alert('Success', 'Order Placed Successfully!', [
            { text: 'OK', onPress: () => navigation.navigate('CustomerHome') },
        ]);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.header, { color: colors.text }]}>Checkout</Text>

                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Order Subtotal</Text>
                    <Text style={[styles.amount, { color: colors.primary }]}>₹{total.toFixed(2)}</Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Delivery Charge</Text>
                    <Text style={[styles.amount, { color: colors.primary }]}>₹{DELIVERY_CHARGE.toFixed(2)}</Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Total Amount</Text>
                    <Text style={[styles.amount, { color: colors.primary }]}>₹{(total + DELIVERY_CHARGE).toFixed(2)}</Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Delivery Address</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                        placeholder="Enter full address"
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={3}
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Payment Method</Text>
                    <TouchableOpacity
                        style={[styles.radioOption, paymentMethod === 'cod' && styles.selectedOption]}
                        onPress={() => setPaymentMethod('cod')}
                    >
                        <Text style={{ color: colors.text }}>Cash on Delivery</Text>
                        {paymentMethod === 'cod' && <Text style={{ color: colors.success }}>✓</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.radioOption, paymentMethod === 'upi' && styles.selectedOption]}
                        onPress={() => setPaymentMethod('upi')}
                    >
                        <Text style={{ color: colors.text }}>UPI / Online (Dummy)</Text>
                        {paymentMethod === 'upi' && <Text style={{ color: colors.success }}>✓</Text>}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.placeOrderBtn, { backgroundColor: colors.success }]} onPress={handlePlaceOrder} activeOpacity={0.85}>
                    <Text style={styles.btnText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    section: { padding: 15, borderRadius: 8, borderWidth: 1, marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    amount: { fontSize: 24, fontWeight: 'bold' },
    input: { borderWidth: 1, borderRadius: 4, padding: 10, textAlignVertical: 'top' },
    radioOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, marginBottom: 10 },
    selectedOption: { borderColor: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.1)' },
    placeOrderBtn: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 20,
    marginBottom: 40,
        minHeight: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    btnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
});

export default CheckoutScreen;
