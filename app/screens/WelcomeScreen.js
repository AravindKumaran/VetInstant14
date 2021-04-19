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
        <AppButton
          title="Login"
          onPress={() => navigation.navigate("Auth", { title: "Login" })}
        />
        <AppButton
          title="Sign up"
          onPress={() => navigation.navigate("Auth", { title: "Register" })}
        />
        <Image source={require("../components/assets/images/petimage.png")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // padding: 15,
    paddingTop: 50,
  },
  container1: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    paddingTop: 80,
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
