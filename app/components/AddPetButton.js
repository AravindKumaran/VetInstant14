import React from "react";

import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import AppText from "./AppText";

const AddPetButton = ({ title, onPress, name, img }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        {title ? (
          <>
            <Text style={styles.text}>+</Text>
            <Text style={styles.text}>Add a Pet</Text>
          </>
        ) : (
          <Image
            source={{
              uri: `http://192.168.43.242:8000/${img}`,
            }}
            style={{ width: 150, height: 150, borderRadius: 75 }}
          />
        )}
      </TouchableOpacity>
      {/* {img && (

      )} */}
      {name && <AppText>{name}</AppText>}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 150,
    height: 150,
  },
  container: {
    marginVertical: 30,
    marginRight: 15,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AddPetButton;
