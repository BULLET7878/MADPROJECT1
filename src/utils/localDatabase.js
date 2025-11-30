import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const ITEMS_KEY = '@krina_items';
const ORDERS_KEY = '@krina_orders';
const IMAGES_KEY = '@krina_images';

// Local Database Service
const LocalDB = {
  // ITEMS MANAGEMENT
  async getItems() {
    try {
      const items = await AsyncStorage.getItem(ITEMS_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error getting items:', error);
      return [];
    }
  },

  async addItem(item) {
    try {
      const items = await this.getItems();
      const newItem = {
        id: Date.now().toString(), // Simple ID using timestamp
        ...item,
        createdAt: new Date().toISOString(),
      };
      items.push(newItem);
      await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  async updateItem(id, updatedItem) {
    try {
      const items = await this.getItems();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Item not found');
      
      items[index] = {
        ...items[index],
        ...updatedItem,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
      return items[index];
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  async deleteItem(id) {
    try {
      const items = await this.getItems();
      const filtered = items.filter(item => item.id !== id);
      await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  async getItemById(id) {
    try {
      const items = await this.getItems();
      return items.find(item => item.id === id);
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },

  // ORDERS MANAGEMENT
  async getOrders() {
    try {
      const orders = await AsyncStorage.getItem(ORDERS_KEY);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  async addOrder(order) {
    try {
      const orders = await this.getOrders();
      const newOrder = {
        id: Date.now().toString(),
        ...order,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      orders.push(newOrder);
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  async updateOrder(id, updatedOrder) {
    try {
      const orders = await this.getOrders();
      const index = orders.findIndex(order => order.id === id);
      if (index === -1) throw new Error('Order not found');
      
      orders[index] = {
        ...orders[index],
        ...updatedOrder,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      return orders[index];
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async getOrdersByUser(userId) {
    try {
      const orders = await this.getOrders();
      return orders.filter(order => order.userId === userId);
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  },

  // IMAGES MANAGEMENT
  async saveImage(imageUri, itemId) {
    try {
      const images = await AsyncStorage.getItem(IMAGES_KEY);
      const imageMap = images ? JSON.parse(images) : {};
      imageMap[itemId] = imageUri;
      await AsyncStorage.setItem(IMAGES_KEY, JSON.stringify(imageMap));
      return imageUri;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  },

  async getImage(itemId) {
    try {
      const images = await AsyncStorage.getItem(IMAGES_KEY);
      const imageMap = images ? JSON.parse(images) : {};
      return imageMap[itemId] || null;
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  },

  async deleteImage(itemId) {
    try {
      const images = await AsyncStorage.getItem(IMAGES_KEY);
      const imageMap = images ? JSON.parse(images) : {};
      delete imageMap[itemId];
      await AsyncStorage.setItem(IMAGES_KEY, JSON.stringify(imageMap));
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // CLEAR ALL DATA (for testing/reset)
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([ITEMS_KEY, ORDERS_KEY, IMAGES_KEY]);
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },

  // EXPORT DATA
  async exportData() {
    try {
      const items = await this.getItems();
      const orders = await this.getOrders();
      return {
        items,
        orders,
        exportedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },
};

export default LocalDB;
