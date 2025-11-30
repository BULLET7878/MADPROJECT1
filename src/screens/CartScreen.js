import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { cart, removeFromCart, updateQuantity, applyCoupon, clearCoupon, coupon, getTotals } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const { subtotal, discountAmount, total } = getTotals();

    const handleApplyCoupon = () => {
        if (!couponCode) return;
        const success = applyCoupon(couponCode);
        if (success) {
            Alert.alert('Success', 'Coupon applied!');
        } else {
            Alert.alert('Error', 'Invalid coupon code');
        }
        setCouponCode('');
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.itemInfo}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.price, { color: colors.text }]}>₹{item.price} x {item.qty}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={[styles.qtyBtn, { borderColor: colors.border }]}>
                    <Text style={{ color: colors.text }}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.qty, { color: colors.text }]}>{item.qty}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={[styles.qtyBtn, { borderColor: colors.border }]}>
                    <Text style={{ color: colors.text }}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
                    <Text style={{ color: colors.danger }}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.container}>
                {cart.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{ color: colors.text }}>Your cart is empty</Text>
                </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={cart}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                        />
                        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                        {/* Coupon Section */}
                        <View style={styles.couponSection}>
                            {coupon ? (
                                <View style={styles.couponApplied}>
                                    <Text style={{ color: 'green' }}>Coupon {coupon.code} applied!</Text>
                                    <TouchableOpacity onPress={clearCoupon}>
                                        <Text style={{ color: colors.danger, marginLeft: 10 }}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.couponInputContainer}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                                        placeholder="Enter Coupon (SAVE10)"
                                        placeholderTextColor="#888"
                                        value={couponCode}
                                        onChangeText={setCouponCode}
                                    />
                                    <TouchableOpacity onPress={handleApplyCoupon} style={[styles.applyBtn, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.btnText}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Totals */}
                        <View style={styles.row}>
                            <Text style={{ color: colors.text }}>Subtotal:</Text>
                            <Text style={{ color: colors.text }}>₹{subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={{ color: colors.text }}>Discount:</Text>
                            <Text style={{ color: 'green' }}>-₹{discountAmount.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.row, styles.totalRow]}>
                            <Text style={[styles.totalText, { color: colors.text }]}>Total:</Text>
                            <Text style={[styles.totalText, { color: colors.primary }]}>₹{total.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.checkoutBtn, { backgroundColor: colors.success }]}
                            onPress={() => navigation.navigate('Checkout')}
                        >
                            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: { 
        flex: 1,
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    list: { 
        padding: 10,
        paddingBottom: 120, 
    },
    card: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
    },
    itemInfo: { marginBottom: 10 },
    name: { fontSize: 16, fontWeight: 'bold' },
    price: { fontSize: 14, marginTop: 4 },
    actions: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
    },
    qty: { marginHorizontal: 15, fontSize: 16 },
    removeBtn: { marginLeft: 'auto' },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    couponSection: { marginBottom: 15 },
    couponInputContainer: { flexDirection: 'row' },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginRight: 10,
    },
    applyBtn: {
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderRadius: 4,
    },
    couponApplied: { flexDirection: 'row', alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    totalRow: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
    totalText: { fontSize: 18, fontWeight: 'bold' },
    checkoutBtn: {
        marginTop: 15,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    checkoutText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default CartScreen;
