import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";
import { Header } from "react-native-elements";
import ChatScreen from "./ChatScreen";
import AppButton from "../components/AppButton";

const MyCustomLeftComponent = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Feather
        style={{
          // position: "absolute",
          color: "#476880",
          right: 0,
          bottom: 0,
        }}
        name={"arrow-left"}
        size={45}
      />
    </TouchableOpacity>
  );
};

const ActiveStyle = () => (
  <View
    style={{
      width: 30,
      height: 4,
      borderRadius: 14,
      position: "absolute",
      top: 20,
      borderBottomColor: "#6ADFA7",
      borderBottomWidth: 2,
      alignSelf: "center",
    }}
  ></View>
);

const doctors = [
  {
    src: require("../../assets/doctor1.png"),
    name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
  },
  // {
  //   src: require("../../assets/doctor2.png"),
  //   name: "Your chat with Dr. R. Vijayashanthini has ended.",
  // },
  // {
  //   src: require("../../assets/doctor1.png"),
  //   name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
  // },
  // {
  //   src: require("../../assets/doctor2.png"),
  //   name: "Your chat with Dr. R. Vijayashanthini has ended.",
  // },
];

const PetLobby = () => {
  const [active, setActive] = useState("videocall");

  const handleActive = (value) => {
    setActive(value);
  };

  return (
    <View style={styles.container}>
      <Header
        leftComponent={<MyCustomLeftComponent />}
        centerComponent={{
          text: "Room",
          style: { color: "#476880", fontSize: 20, fontWeight: "700", top: 10 },
        }}
        containerStyle={{
          backgroundColor: "white",
          height: 90,
        }}
      />

      <View>
        <View style={styles.catItem2}>
          <Image
            source={require("../../assets/doctor1.png")}
            size={15}
            style={{
              height: 80,
              width: 80,
              borderRadius: 50,
              borderWidth: 5,
              borderColor: "#FFFFFF",
              padding: 10,
            }}
          />
          <Image
            source={require("../../assets/doctor2.png")}
            size={15}
            style={{
              height: 80,
              width: 80,
              borderRadius: 50,
              borderWidth: 5,
              borderColor: "#FFFFFF",
              padding: 10,
            }}
          />
          <View styles={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 14, color: "#47687F", fontWeight: "700" }}>
              Dr. Kumar & Bruno ‘s room
            </Text>
            <Text style={{ fontSize: 12, color: "#A3B1BF", fontWeight: "400" }}>
              Room ID : #141526
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.choose}>
        <View>
          {active === "videocall" ? <ActiveStyle /> : <View />}
          <TouchableWithoutFeedback onPress={() => handleActive("videocall")}>
            <Text
              style={[
                styles.text1,
                { color: active === "videocall" ? "#41CE8A" : "#476880" },
              ]}
            >
              Video Call
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View>
          {active === "chat" ? <ActiveStyle /> : <View />}
          <TouchableWithoutFeedback onPress={() => handleActive("chat")}>
            <Text
              style={[
                styles.text1,
                { color: active === "chat" ? "#41CE8A" : "#476880" },
              ]}
            >
              Chat
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View>
          {active === "sharableassets" ? <ActiveStyle /> : <View />}
          <TouchableWithoutFeedback
            onPress={() => handleActive("sharableassets")}
          >
            <Text
              style={[
                styles.text1,
                { color: active === "sharableassets" ? "#41CE8A" : "#476880" },
              ]}
            >
              Sharable Assets
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
      {active === "videocall" && (
        <View style={{ alignItems: "center", padding: 30 }}>
          <Text
            style={{
              margin: 10,
            }}
          >
            <Text style={{ color: "#47687F", fontWeight: "400", fontSize: 14 }}>
              Call Scheduled at
            </Text>{" "}
            <Text style={{ color: "#41CE8A", fontWeight: "400", fontSize: 14 }}>
              11th April 07:00 pm
            </Text>
          </Text>
          <Image
            source={require("../../assets/doctor1.png")}
            size={15}
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              borderWidth: 5,
              borderColor: "#FFFFFF",
              padding: 10,
              margin: 10,
            }}
          />
          <Text
            style={{
              margin: 10,
            }}
          >
            Dr.Kumar has joined the call
          </Text>
          <AppButton
            title="Join Video Call"
            // onPress={() => navigation.navigate("SaveVet")}
          />
        </View>
      )}
      {/* {active === "chat" && <ChatScreen />} */}
    </View>
  );
};

export default PetLobby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  catItem1: {
    alignSelf: "center",
    marginTop: 30,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
  },
  text2: {
    color: "#FA7C7C",
    fontSize: 14,
    fontWeight: "400",
  },
  text3: {
    color: "#37CF86",
    fontSize: 12,
    fontWeight: "400",
  },
  catItem2: {
    borderRadius: 30,
    flexDirection: "row",
    padding: 25,
    alignItems: "center",
  },
});