import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, View } from 'react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { InventoryProvider } from './context/InventoryContext';
import { OrderProvider } from './context/OrderContext';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderHistoryScreen from './screens/customer/OrderHistoryScreen';
import SellerHomeScreen from './screens/seller/SellerHomeScreen';
import SellerOrdersScreen from './screens/seller/SellerOrdersScreen';
import AddItemScreen from './screens/seller/AddItemScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Customer Bottom Tabs
const CustomerTabs = () => {
    const { colors, isDarkMode, toggleTheme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,  // This will hide the header for all tabs
                tabBarStyle: { 
                    backgroundColor: colors.card, 
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: 5,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Shop') iconName = '🏠';
                    else if (route.name === 'Cart') iconName = '🛒';
                    else if (route.name === 'Orders') iconName = '📜';
                    return <Text style={{ fontSize: 24, marginTop: 5 }}>{iconName}</Text>;
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                },
            })}
        >
            <Tab.Screen 
                name="Shop" 
                component={HomeScreen} 
                options={{ 
                    title: 'Shop',
                }} 
            />
            <Tab.Screen 
                name="Cart" 
                component={CartScreen} 
                options={{ 
                    title: 'Cart',
                }} 
            />
            <Tab.Screen 
                name="Orders" 
                component={OrderHistoryScreen} 
                options={{ 
                    title: 'Orders',
                }} 
            />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    const { colors, isDarkMode, toggleTheme } = useTheme();

    const CustomTheme = {
        ...(isDarkMode ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
            notification: colors.primary,
        },
    };

    return (
        <NavigationContainer theme={CustomTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: colors.card },
                    headerTintColor: colors.text,
                    headerRight: () => (
                        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
                            <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
                        </TouchableOpacity>
                    )
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

                {/* Customer Flow */}
                <Stack.Screen
                    name="CustomerHome"
                    component={CustomerTabs}
                    options={{
                        headerShown: false,
                        title: ''
                    }}
                />
                <Stack.Screen 
                    name="Checkout" 
                    component={CheckoutScreen}
                    options={{
                        title: 'Checkout',
                        headerShown: true,
                        headerTitleAlign: 'center',
                    }}
                />

                {/* Seller Flow */}
                <Stack.Screen name="SellerHome" component={SellerHomeScreen} options={{ title: 'Seller Dashboard' }} />
                <Stack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Add New Item' }} />
                <Stack.Screen name="SellerOrders" component={SellerOrdersScreen} options={{ title: 'Order History' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <ThemeProvider>
            <InventoryProvider>
                <CartProvider>
                    <OrderProvider>
                        <Navigation />
                    </OrderProvider>
                </CartProvider>
            </InventoryProvider>
        </ThemeProvider>
    );
}
