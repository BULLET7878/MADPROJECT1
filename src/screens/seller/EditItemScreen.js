import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image, Modal, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';

const EditItemScreen = ({ route, navigation }) => {
    const { itemId } = route.params;
    const { colors } = useTheme();
    const { updateItem, getItemById } = useInventory();
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({
        name: '',
        price: '',
        quantity: '',
        unit: 'kg',
        discount: '0',
        image: null
    });

    const units = ['kg', 'gm', 'litre', 'ml', 'pack', 'pc', 'none'];

    useEffect(() => {
        // Load item data when component mounts
        const item = getItemById(itemId);
        if (item) {
            setForm({
                name: item.name,
                price: item.price.toString(),
                quantity: item.quantity.toString(),
                unit: item.unit,
                discount: item.discount ? item.discount.toString() : '0',
                image: item.image
            });
        }
    }, [itemId]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleChange('image', result.assets[0].uri);
        }
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleUnitSelect = (unit) => {
        handleChange('unit', unit);
        setModalVisible(false);
    };

    const handleSubmit = () => {
        if (!form.name || !form.price || !form.quantity) {
            Alert.alert('Error', 'Please fill in all required fields: Name, Price, and Quantity');
            return;
        }

        // Validate price and quantity are positive numbers
        if (Number(form.price) <= 0 || Number(form.quantity) <= 0) {
            Alert.alert('Error', 'Price and Quantity must be greater than 0');
            return;
        }

        try {
            updateItem(itemId, {
                name: form.name.trim(),
                price: Number(form.price),
                quantity: Number(form.quantity),
                unit: form.unit || 'kg',
                discount: Number(form.discount) || 0,
                image: form.image || 'https://via.placeholder.com/300x300?text=No+Image',
                id: itemId
            });

            Alert.alert('Success', 'Item Updated Successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error updating item:', error);
            Alert.alert('Error', error.message || 'Failed to update item. Please try again.');
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <TouchableOpacity onPress={pickImage} style={[styles.imagePicker, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    {form.image ? (
                        <Image source={{ uri: form.image }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={{ fontSize: 40 }}>📷</Text>
                            <Text style={{ color: colors.text, marginTop: 10 }}>Tap to change photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={[styles.label, { color: colors.text }]}>Product Name</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                    value={form.name}
                    onChangeText={t => handleChange('name', t)}
                    placeholder="e.g. Basmati Rice"
                    placeholderTextColor="#888"
                />

                <Text style={[styles.label, { color: colors.text }]}>Price (₹)</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                    value={form.price}
                    onChangeText={t => handleChange('price', t.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#888"
                />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.label, { color: colors.text }]}>Quantity</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                            value={form.quantity}
                            onChangeText={t => handleChange('quantity', t.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
                        <TouchableOpacity 
                            style={[styles.selectBtn, { borderColor: colors.border, borderWidth: 1, backgroundColor: colors.primary }]} 
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.selectBtnText}>{form.unit || 'Select'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.label, { color: colors.text }]}>Discount (%)</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                    value={form.discount}
                    onChangeText={t => handleChange('discount', t.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#888"
                />

                <TouchableOpacity 
                    style={[styles.submitButton, { backgroundColor: colors.primary }]} 
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Update Item</Text>
                </TouchableOpacity>
            </View>

            {/* Unit Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Select Unit</Text>
                        <FlatList
                            data={units}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.unitItem, { borderBottomColor: colors.border }]}
                                    onPress={() => handleUnitSelect(item)}
                                >
                                    <Text style={{ color: colors.text }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: colors.primary }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    content: { 
        padding: 20,
        paddingBottom: 40,
    },
    imagePicker: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    selectBtn: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    selectBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    submitButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 25,
        minHeight: 50,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        margin: 20,
        borderRadius: 24,
        padding: 20,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    unitItem: {
        padding: 15,
        borderBottomWidth: 1,
    },
    closeButton: {
        marginTop: 15,
        minHeight: 48,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default EditItemScreen;
