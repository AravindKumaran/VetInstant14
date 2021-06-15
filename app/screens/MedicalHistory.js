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
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { Header } from "react-native-elements";
import ReminderScreen from "./ReminderScreen";
import PetPrescriptionScreen from "../screens/PetPrescription";
import AppText from "../components/AppText";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";
import { ScrollView } from "react-native-gesture-handler";
import Searchbar from "../components/searchbar";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const type = [
  { label: "Via VetInstant", value: "Via VetInstant" },
  { label: "Vaccinations", value: "Vaccinations" },
  { label: "General Checkup", value: "General Checkup" },
];

const MedicalHistory = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <Formik
          initialValues={{
            pet: "",
          }}
        >
          <>
            <ChoosePicker
              items={pet}
              label="Choose your pet"
              name="pet"
              placeholder="Choose your pet"
            />
            <View style={{ marginTop: 20 }}>
              <ChoosePicker
                items={type}
                label="Problem type"
                name="type"
                placeholder="Problem type"
              />
            </View>
          </>
        </Formik>
        <View
          style={{
            flexDirection: "row",
            width: "85%",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            alignSelf: "center",
            marginVertical: 10,
          }}
        >
          <Searchbar />
          <TouchableOpacity>
            <Feather
              name={"plus"}
              size={40}
              color={"#41CE8A"}
              style={{
                alignSelf: "center",
                borderRadius: 50,
                elevation: 10,
                backgroundColor: "#FFFFFF",
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 105,
            width: "95%",
            alignSelf: "center",
            borderRadius: 20,
            padding: 10,
            elevation: 10,
            backgroundColor: "#FFFFFF",
            marginBottom: 10,
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
            <TouchableOpacity
              onPress={() => navigation.navigate("MedicalHistoryPets")}
            >
              <Text
                style={{ color: "#41CE8A", fontWeight: "700", fontSize: 14 }}
              >
                VIEW
              </Text>
            </TouchableOpacity>
          </View>
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
  container1: {
    marginVertical: 30,
    marginHorizontal: 20,
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
