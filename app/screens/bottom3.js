import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  StyleSheet,
} from "react-native";

const Bottom3 = () => {
  return (
    <View style={styles.container}>
      <Text>Bottom3</Text>
    </View>
  );
};

export default Bottom3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
});
