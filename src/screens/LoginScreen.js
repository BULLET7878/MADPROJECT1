import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const validateForm = () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // For demo purposes, any email/password will work
            navigation.navigate('CustomerHome');
        }, 1000);
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={[styles.title, { color: colors.primary }]}>Welcome Back!</Text>
                    <Text style={[styles.subtitle, { color: colors.text }]}>
                        {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
                    </Text>

                    <View style={styles.form}>
                        <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.submitButton, { backgroundColor: colors.primary }]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            <Text style={styles.submitButtonText}>
                                {isLoading ? 'Please Wait...' : isLogin ? 'Sign In' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.switchModeContainer}
                            onPress={() => setIsLogin(!isLogin)}
                        >
                            <Text style={[styles.switchModeText, { color: colors.primary }]}>
                                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.text, backgroundColor: colors.background }]}>
                            OR
                        </Text>
                    </View>

                    <View style={styles.roleContainer}>
                        <Text style={[styles.roleTitle, { color: colors.text }]}>Continue as</Text>
                        <View style={styles.roleButtons}>
                            <TouchableOpacity
                                style={[styles.roleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                                onPress={() => navigation.navigate('SellerHome')}
                            >
                                <Text style={[styles.roleButtonText, { color: colors.text }]}>👨‍💼 Seller</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.roleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                                onPress={() => navigation.navigate('CustomerHome')}
                            >
                                <Text style={[styles.roleButtonText, { color: colors.text }]}>🛒 Customer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.8,
    },
    form: {
        marginBottom: 20,
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 50,
        justifyContent: 'center',
    },
    input: {
        fontSize: 16,
        height: '100%',
    },
    submitButton: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    switchModeContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchModeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    dividerContainer: {
        marginVertical: 25,
        height: 1,
        position: 'relative',
    },
    divider: {
        height: 1,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    dividerText: {
        position: 'absolute',
        top: -10,
        alignSelf: 'center',
        paddingHorizontal: 15,
        fontSize: 14,
    },
    roleContainer: {
        alignItems: 'center',
    },
    roleTitle: {
        fontSize: 16,
        marginBottom: 15,
        opacity: 0.8,
    },
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    roleButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    roleButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default LoginScreen;
