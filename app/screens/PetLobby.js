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
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Header } from "react-native-elements";
import ReminderScreen from "./ReminderScreen";
import PetPrescriptionScreen from "../screens/PetPrescription";
import CallPendingScreen from "../screens/callPendingScreen";
import MedicalHistory from "../screens/MedicalHistory";
import PetMedication from "./PetMedication";
import PetVaccination from "./PetVaccination";
import PetProblemScreen from "./PetProblemsScreen";
import { useNavigation } from "@react-navigation/native";

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
    src: require("../components/assets/images/doctor1.png"),
    name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
  },
  // {
  //   src: require("../components/assets/images/doctor2.png"),
  //   name: "Your chat with Dr. R. Vijayashanthini has ended.",
  // },
  // {
  //   src: require("../components/assets/images/doctor1.png"),
  //   name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
  // },
  // {
  //   src: require("../components/assets/images/doctor2.png"),
  //   name: "Your chat with Dr. R. Vijayashanthini has ended.",
  // },
];

const PetLobby = () => {
  const [active, setActive] = useState("vetcalls");

  const handleActive = (value) => {
    setActive(value);
  };

  const navigation = useNavigation();

  const MyCustomLeftComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation?.goBack();
        }}
      >
        <Feather
          name={"arrow-left"}
          size={25}
          color="#476880"
          style={{
            marginLeft: 10,
            top: 5,
          }}
        />
      </TouchableOpacity>
    );
  };

  const MyCustomRightComponent = () => {
    return (
      <Image
        style={{
          height: 40,
          width: 40,
          borderRadius: 50,
          borderWidth: 2.5,
          borderColor: "#FFFFFF",
          marginRight: 10,
          paddingRight: 20,
        }}
      />
    );
  };

  return (
    <>
      <Header
        leftComponent={<MyCustomLeftComponent />}
        rightComponent={<MyCustomRightComponent />}
        centerComponent={{
          text: "Pet Lobby",
          style: {
            color: "#476880",
            fontSize: 20,
            fontWeight: "700",
            top: 5,
          },
        }}
        containerStyle={{
          backgroundColor: "#FFFFFF",
          elevation: 5,
          borderBottomStartRadius: 15,
          borderBottomEndRadius: 15,
        }}
      />
      <View style={styles.container}>
        <View style={styles.container1}>
          <View style={styles.choose}>
            <View>
              {active === "vetcalls" ? <ActiveStyle /> : <View />}
              <TouchableWithoutFeedback
                onPress={() => handleActive("vetcalls")}
              >
                <Text
                  style={[
                    styles.text1,
                    { color: active === "vetcalls" ? "#41CE8A" : "#476880" },
                  ]}
                >
                  Vet Calls
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View>
              {active === "prescriptions" ? <ActiveStyle /> : <View />}
              <TouchableWithoutFeedback
                onPress={() => handleActive("prescriptions")}
              >
                <Text
                  style={[
                    styles.text1,
                    {
                      color: active === "prescriptions" ? "#41CE8A" : "#476880",
                    },
                  ]}
                >
                  Prescriptions
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View>
              {active === "reminders" ? <ActiveStyle /> : <View />}
              <TouchableWithoutFeedback
                onPress={() => handleActive("reminders")}
              >
                <Text
                  style={[
                    styles.text1,
                    { color: active === "reminders" ? "#41CE8A" : "#476880" },
                  ]}
                >
                  Reminders
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View>
              {active === "history" ? <ActiveStyle /> : <View />}
              <TouchableWithoutFeedback onPress={() => handleActive("history")}>
                <Text
                  style={[
                    styles.text1,
                    { color: active === "history" ? "#41CE8A" : "#476880" },
                  ]}
                >
                  Medical History
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          {/* <View>
          {active === "medication" ? <ActiveStyle /> : <View />}
          <TouchableWithoutFeedback onPress={() => handleActive("medication")}>
            <Text
              style={[
                styles.text1,
                { color: active === "medication" ? "#41CE8A" : "#476880" },
              ]}
            >
              Pet Medication
            </Text>
          </TouchableWithoutFeedback>
        </View> */}
        </View>
        {active === "vetcalls" && <CallPendingScreen />}
        {active === "prescriptions" && <PetPrescriptionScreen />}
        {active === "reminders" && <ReminderScreen />}
        {active === "history" && <MedicalHistory />}
        {/* {active === "medication" && <PetVaccination />} */}
      </View>
    </>
  );
};

export default PetLobby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  catItem1: {
    // flexDirection: "column",
    alignSelf: "center",
    marginTop: 30,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
    paddingLeft: 15,
    paddingRight: 15,
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
    flexDirection: "row",
    alignItems: "flex-end",
    bottom: 20,
    borderRadius: 30,
  },
});
