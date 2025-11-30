import React, { useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';

const HomeScreen = ({ navigation }) => {
    const { colors, isDarkMode } = useTheme();
    const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
    const { items, loading, error, loadItems } = useInventory();
    const flatListRef = useRef(null);

    const getCartItem = (id) => cart.find(i => i.id === id);

    const handleDecrement = (item) => {
        const cartItem = getCartItem(item.id);
        if (cartItem.qty > 1) {
            updateQuantity(item.id, -1);
        } else {
            removeFromCart(item.id);
        }
    };

    const renderItem = ({ item }) => {
        const cartItem = getCartItem(item.id);

        return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Image source={{ uri: item.image }} style={styles.image} />

                <View style={styles.details}>
                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.priceTag}>
                        <Text style={[styles.price, { color: colors.primary }]}>₹{item.price}</Text>
                        <Text style={[styles.unit, { color: colors.text }]}>/{item.unit}</Text>
                    </View>
                    {item.discount > 0 && (
                        <Text style={styles.discount}>{item.discount}% Off</Text>
                    )}
                </View>

                {cartItem ? (
                    <View style={[styles.qtyContainer, { backgroundColor: colors.background }]}>
                        <TouchableOpacity
                            style={[styles.qtyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => handleDecrement(item)}
                        >
                            <Text style={[styles.qtyBtnText, { color: colors.text }]}>-</Text>
                        </TouchableOpacity>
                        <Text style={[styles.qtyText, { color: colors.text }]}>{cartItem.qty}</Text>
                        <TouchableOpacity
                            style={[styles.qtyBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                            onPress={() => addToCart(item)}
                        >
                            <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                        onPress={() => addToCart(item)}
                    >
                        <Text style={styles.btnText}>ADD</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.container}>
                {loading ? (
                    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.text }]}>Loading products...</Text>
                    </View>
                ) : error ? (
                    <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
                        <Text style={[styles.errorText, { color: colors.danger }]}>⚠️ {error}</Text>
                        <TouchableOpacity 
                            style={[styles.retryButton, { backgroundColor: colors.primary }]}
                            onPress={() => {
                                // Trigger reload by calling loadItems if available
                                if (loadItems) loadItems();
                            }}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : items.length === 0 ? (
                    <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
                        <Text style={[styles.emptyText, { color: colors.text }]}>No products available</Text>
                    </View>
                ) : (
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.list}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                    />
                )}
                {cart.length > 0 && (
                    <View style={[styles.placeOrderContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                        <TouchableOpacity 
                            style={[styles.placeOrderButton, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate('Cart')}
                        >
                            <Text style={styles.placeOrderText}>Place Order ({cart.reduce((sum, item) => sum + item.qty, 0)})</Text>
                            <Text style={styles.placeOrderAmount}>
                                ₹{cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}
                            </Text>
                        </TouchableOpacity>
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
        paddingBottom: 0,
    },
    list: {
        padding: 8,
        paddingBottom: 100, // Extra padding for bottom safe area and button
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        margin: 8,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 3,
        maxWidth: '46%', // Ensure 2 items fit with margins
    },
    image: {
        width: '100%',
        height: 120,
        backgroundColor: '#f0f0f0',
    },
    details: {
        padding: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    priceTag: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
    },
    unit: {
        fontSize: 12,
        fontWeight: '500',
        opacity: 0.6,
    },
    discount: {
        color: '#4caf50',
        fontSize: 10,
        fontWeight: '700',
        backgroundColor: '#e8f5e9',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    addButton: {
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        borderRadius: 8,
    },
    btnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 4,
        margin: 8,
        borderRadius: 8,
    },
    qtyBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
    },
    qtyBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    qtyText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    placeOrderContainer: {
        position: 'relative',
        padding: 16,
        paddingBottom: 20, // Extra padding for bottom safe area
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    placeOrderButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    placeOrderText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    placeOrderAmount: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default HomeScreen;
