import React from "react";

import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import LinearGradient from "react-native-linear-gradient";

const AppButton = ({ title, onPress, btnStyle, txtStyle, iconName }) => {
  return (
    <TouchableOpacity style={[styles.button, btnStyle]} onPress={onPress}>
      {/* {iconName && (
        <Feather style={styles.icon} name={iconName} size={25} color="#FFFFFF" />
      )} */}
      {title && (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#76F8B9", "#41CE8A"]}
          style={styles.button}
        >
          <Text style={[styles.text, txtStyle]}>{title}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical: 0,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
});

export default AppButton;
