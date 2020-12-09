import React, { useEffect } from "react";

import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const ImageInput = ({ imageUri, onChangeImage }) => {
  const requestPermissions = async () => {
    try {
      const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (!granted) {
        alert("You need to enable permission to access the library!");
      }
    } catch (error) {
      console.log("Error in permissions", error);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const handlePress = () => {
    // requestPermissions();
    if (!imageUri) {
      selectImage();
    } else {
      Alert.alert("Delete", "Are you sure you want to delete this image", [
        { text: "Yes", onPress: () => onChangeImage(null) },
        { text: "No" },
      ]);
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      console.log(result);
      if (!result.cancelled) onChangeImage(result.uri);
    } catch (error) {
      console.log("Error in picking image", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!imageUri && (
          <MaterialCommunityIcons name='camera' size={40} color='#000' />
        )}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    overflow: "hidden",
    width: 100,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageInput;
