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
import ReminderScreen from "./ReminderScreen";
import PetPrescriptionScreen from "../screens/PetPrescription";
import AppText from "../components/AppText";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";
import { ScrollView } from "react-native-gesture-handler";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const MedicalHistory = () => {
  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          pet: "",
        }}
      >
        <ChoosePicker items={pet} label="Choose your pet" name="pet" />
      </Formik>
      <TouchableOpacity>
        <Feather
          name={"plus-circle"}
          size={50}
          color={"#41CE8A"}
          style={{
            backgroundColor: "white",
            alignSelf: "center",
            borderRadius: 50,
            marginVertical: 50,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 125,
          borderWidth: 1,
          width: "95%",
          alignSelf: "center",
          borderRadius: 20,
          padding: 10,
        }}
      >
        <View
          style={{
            height: 75,
            width: 75,
            borderRadius: 20,
            backgroundColor: "rgba(65, 206, 138, 0.2)",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
            }}
          >
            15 May
          </Text>
        </View>
        <View style={{ marginRight: 150, marginHorizontal: 20 }}>
          <Text style={{ color: "#47687F", fontSize: 14, fontWeight: "700" }}>
            Digestion problem
          </Text>
          <Text style={{ color: "#B9C4CF", fontSize: 12, fontWeight: "400" }}>
            Treated by Dr. Kumar at Global Veteneriary Hospitals
          </Text>
        </View>
        <View style={{ right: 120 }}>
          <TouchableOpacity>
            <Text style={{ color: "#41CE8A", fontWeight: "700", fontSize: 14 }}>
              VIEW
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 125,
          borderWidth: 1,
          width: "95%",
          alignSelf: "center",
          borderRadius: 20,
          padding: 10,
          marginVertical: 50,
        }}
      >
        <View
          style={{
            height: 75,
            width: 75,
            borderRadius: 20,
            backgroundColor: "rgba(65, 206, 138, 0.2)",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
            }}
          >
            15 April
          </Text>
        </View>
        <View style={{ marginRight: 150, marginHorizontal: 20 }}>
          <Text style={{ color: "#47687F", fontSize: 14, fontWeight: "700" }}>
            Digestion problem
          </Text>
          <Text style={{ color: "#B9C4CF", fontSize: 12, fontWeight: "400" }}>
            Treated by Dr. Kumar at Global Veteneriary Hospitals
          </Text>
        </View>
        <View style={{ right: 120 }}>
          <TouchableOpacity>
            <Text style={{ color: "#41CE8A", fontWeight: "700", fontSize: 14 }}>
              VIEW
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 125,
          borderWidth: 1,
          width: "95%",
          alignSelf: "center",
          borderRadius: 20,
          padding: 10,
        }}
      >
        <View
          style={{
            height: 75,
            width: 75,
            borderRadius: 20,
            backgroundColor: "rgba(65, 206, 138, 0.2)",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
            }}
          >
            15 March
          </Text>
        </View>
        <View style={{ marginRight: 150, marginHorizontal: 20 }}>
          <Text style={{ color: "#47687F", fontSize: 14, fontWeight: "700" }}>
            Digestion problem
          </Text>
          <Text style={{ color: "#B9C4CF", fontSize: 12, fontWeight: "400" }}>
            Treated by Dr. Kumar at Global Veteneriary Hospitals
          </Text>
        </View>
        <View style={{ right: 120 }}>
          <TouchableOpacity>
            <Text style={{ color: "#41CE8A", fontWeight: "700", fontSize: 14 }}>
              VIEW
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 125,
          borderWidth: 1,
          width: "95%",
          alignSelf: "center",
          borderRadius: 20,
          padding: 10,
          marginVertical: 50,
        }}
      >
        <View
          style={{
            height: 75,
            width: 75,
            borderRadius: 20,
            backgroundColor: "rgba(65, 206, 138, 0.2)",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
            }}
          >
            15 February
          </Text>
        </View>
        <View style={{ marginRight: 150, marginHorizontal: 20 }}>
          <Text style={{ color: "#47687F", fontSize: 14, fontWeight: "700" }}>
            Digestion problem
          </Text>
          <Text style={{ color: "#B9C4CF", fontSize: 12, fontWeight: "400" }}>
            Treated by Dr. Kumar at Global Veteneriary Hospitals
          </Text>
        </View>
        <View style={{ right: 120 }}>
          <TouchableOpacity>
            <Text style={{ color: "#41CE8A", fontWeight: "700", fontSize: 14 }}>
              VIEW
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MedicalHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
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
