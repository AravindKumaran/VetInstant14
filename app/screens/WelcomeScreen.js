import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Find Doctors</Text>
      <Text style={styles.text2}>with a touch.</Text>
      <View style={styles.container1}>
        <AppButton title="Login" onPress={() => navigation.navigate("Login")} />
        <AppButton
          title="Sign up"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Image source={require("../components/assets/images/petimage.png")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    margin: 40,
  },
  text1: {
    color: "#49D491",
    fontSize: 42,
    fontWeight: "600",
    fontFamily: "nunito.regular",
  },
  text2: {
    color: "#47687F",
    fontSize: 42,
    fontWeight: "800",
    fontFamily: "nunito.regular",
  },
});

export default WelcomeScreen;
