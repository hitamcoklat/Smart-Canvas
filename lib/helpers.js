import AsyncStorage from '@react-native-community/async-storage';

export const _storeData = async (name, value) => {
  try {
    await AsyncStorage.setItem(name, value);
  } catch (error) {
    // Error saving data
  }
};

export const _retrieveData = async name => {
  try {
    const value = await AsyncStorage.getItem(name);
    return value;
  } catch (error) {
    // Error retrieving data
  }
};

export const _removeItem = async name => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    // Error retrieving data
  }
};
