import React from "react";
import { StyleSheet } from "react-native";

import AppText from "../AppText";

const ErrorMessage = ({ error, visible }) => {
  if (!visible || !error) return null;
  return <AppText style={styles.error}>{error}</AppText>;
};
const styles = StyleSheet.create({
  error: { color: "red", alignSelf: "center", fontSize: 15, padding: 5 },
});

export default ErrorMessage;
