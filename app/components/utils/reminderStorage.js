import AsyncStorage from '@react-native-async-storage/async-storage'

const storeStringData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log('Error in storing async storage', e)
  }
}

const storeObjectData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.log('Error in storing async storage', e)
  }
}

const getStringData = async () => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch (e) {
    console.log('Error in reading async storage', e)
  }
}

const getObjectData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    if (jsonValue) return JSON.parse(jsonValue)
  } catch (e) {
    console.log('Error in reading async storage', e)
  }
}

const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys()
    return keys
  } catch (e) {
    console.log('Error in reading async storage', e)
  }
}

const removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    console.log('Error in deleting async storage', e)
  }

  console.log('Done.')
}

const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    console.log('Error in reading async storage', e)
  }
}

export {
  storeStringData,
  storeObjectData,
  getObjectData,
  getStringData,
  getAllKeys,
  removeValue,
  clearAll,
}
