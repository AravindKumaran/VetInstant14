import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";

const VideoAuthentication = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.text1}>Success!</Text>
      <Text style={styles.text2}>
        Video call request has been sent to the vet
      </Text>
      <Text style={styles.text3}>You can view the status in our PetLobby.</Text>
      <Text style={styles.text4}>Redirecting you to the PetLobby</Text>
    </ScrollView>
  );
};

export default VideoAuthentication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#49E198",
    alignSelf: "center",
    paddingTop: 20,
    margin: 20,
  },
  text2: {
    color: "#47687F",
    fontSize: 16,
    fontWeight: "700",
    margin: 20,
    alignSelf: "center",
  },
  text3: {
    color: "#47687F",
    fontSize: 14,
    fontWeight: "400",
    alignSelf: "center",
    paddingBottom: 40,
    bottom: 10,
  },
  text4: {
    color: "#B9C4CF",
    fontSize: 14,
    fontWeight: "400",
    alignSelf: "center",
    fontStyle: "italic",
  },
});
