import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import LocalDB from '../../utils/localDatabase';

const AddItemScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { addItem } = useInventory();
    const [modalVisible, setModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        price: '',
        quantity: '',
        unit: 'kg',
        discount: '',
        image: null
    });

    const units = ['kg', 'gm', 'litre', 'ml', 'none'];

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                handleChange('image', result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleUnitSelect = (unit) => {
        handleChange('unit', unit);
        setModalVisible(false);
    };

    const uploadImageAsync = async (uri, itemId) => {
        // For local storage, we just return the URI
        // The image will be stored directly as a local reference
        try {
            if (!uri || typeof uri !== 'string') {
                throw new Error('Invalid image URI');
            }
            
            console.log('✅ Image stored locally:', uri);
            return uri;
        } catch (error) {
            console.error('❌ Error processing image:', error);
            // Return placeholder on error
            return 'https://via.placeholder.com/300x300?text=No+Image';
        }
    };

    const handleSubmit = async () => {
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
            setUploading(true);

            // Handle image
            let imageUrl = 'https://via.placeholder.com/300x300?text=No+Image';

            if (form.image) {
                if (form.image.startsWith('file:')) {
                    // New image selected - save locally
                    imageUrl = await uploadImageAsync(form.image);
                } else {
                    // URL from existing item or placeholder
                    imageUrl = form.image;
                }
            }

            // Create item data with image
            const itemData = {
                name: form.name.trim(),
                price: Number(form.price),
                quantity: Number(form.quantity),
                unit: form.unit || 'kg',
                discount: Number(form.discount) || 0,
                image: imageUrl, // Local image URL or placeholder
            };

            // Add to local database via Context
            const addedItem = await addItem(itemData);

            Alert.alert('Success', 'Item Added Successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error adding item:', error);
            Alert.alert(
                'Error',
                error.message || 'Failed to add item. Please try again.'
            );
        } finally {
            setUploading(false);
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
                            <Text style={{ color: colors.text, marginTop: 10 }}>Tap to add photo</Text>
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
                    onChangeText={t => handleChange('price', t)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#888"
                />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={[styles.label, { color: colors.text }]}>Quantity</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                            value={form.quantity}
                            onChangeText={t => handleChange('quantity', t)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#888"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
                        <TouchableOpacity
                            style={[styles.selectBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={{ color: colors.text }}>{form.unit}</Text>
                            <Text style={{ color: colors.text }}>▼</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.label, { color: colors.text }]}>Discount (%)</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                    value={form.discount}
                    onChangeText={t => handleChange('discount', t)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#888"
                />

                <TouchableOpacity
                    style={[styles.submitButton, {
                        backgroundColor: uploading ? colors.border : colors.primary,
                        opacity: uploading ? 0.7 : 1
                    }]}
                    onPress={handleSubmit}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Add Item</Text>
                    )}
                </TouchableOpacity>

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
                            {units.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.modalItem, { borderBottomColor: colors.border }]}
                                    onPress={() => handleUnitSelect(item)}
                                >
                                    <Text style={[styles.modalItemText, { color: colors.text }]}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={[styles.closeBtn, { backgroundColor: colors.primary }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    content: { 
        padding: 20,
        paddingBottom: 60,
    },
    imagePicker: {
        width: '100%',
        height: 140,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        marginBottom: 36,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { 
        fontSize: 14, 
        fontWeight: '600', 
        marginBottom: 8,
        marginTop: 10,
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
        marginBottom: 15,
        gap: 10,
    },
    selectBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        height: 50,
    },
    submitButton: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 25,
        minHeight: 50,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    submitBtn: {
        width: '100%',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
        justifyContent: 'center',
        minHeight: 48,
    },
    btnText: { 
        color: '#fff', 
        fontSize: 15, 
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '60%',
        paddingBottom: 30,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
    },
    modalItemText: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '500',
    },
    closeBtn: {
        marginTop: 20,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
});

export default AddItemScreen;
