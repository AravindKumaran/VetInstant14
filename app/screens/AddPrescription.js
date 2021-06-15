import React, { useState, useEffect, useRef } from "react";

import {
  Image,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppText from "../components/AppText";

import petsApi from "../api/pets";
import LoadingIndicator from "../components/LoadingIndicator";

import Feather from "react-native-vector-icons/Feather";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";

import RBSheet from "react-native-raw-bottom-sheet";
import AppFormField from "../components/forms/AppFormField";
import AppButton from "../components/AppButton";
import DateTimePicker from "@react-native-community/datetimepicker";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const time = [
  { label: "Morning", value: "Morning" },
  { label: "Afternoon", value: "Afternoon" },
  { label: "Night", value: "Night" },
];

const AddPrescription = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [isSelected, setisSelected] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Formik
          initialValues={{
            pet: "",
          }}
        >
          <>
            <View
              style={{
                top: 10,
                marginBottom: 30,
                alignSelf: "center",
                width: 380,
              }}
            >
              <ChoosePicker
                items={time}
                label="Choose when to take"
                name="time"
                placeholder="Choose when to take"
              />
            </View>
            <AppFormField
              label="Medicing name"
              autoCapitalize="none"
              autoCorrect={false}
              name="Medicing name"
              // placeholder="Medicing name"
            />
            <AppFormField
              label="Quantity"
              autoCapitalize="none"
              autoCorrect={false}
              name="Quantity"
              // placeholder="Quantity"
            />
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                onPress={showDatepicker}
                style={{
                  marginHorizontal: 20,
                  borderColor: "rgba(21, 56, 95, 0.3)",
                  borderWidth: 1,
                  marginBottom: 18,
                  borderRadius: 40,
                  height: 60,
                  width: 150,
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <AppText
                  style={{
                    color: "#47687F",
                    fontSize: 14,
                    alignSelf: "center",
                  }}
                >
                  Select Date
                </AppText>
                <Text
                  style={{
                    color: "rgba(21, 56, 95, 0.3)",
                    fontSize: 16,
                    padding: 2,
                    alignSelf: "center",
                    fontWeight: "700",
                  }}
                >
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={"date"}
                  onChange={onChange}
                  neutralButtonLabel="clear"
                  placeholder="From"
                />
              )}
              <TouchableOpacity
                onPress={showTimepicker}
                style={{
                  marginHorizontal: 20,
                  borderColor: "rgba(21, 56, 95, 0.3)",
                  borderWidth: 1,
                  marginBottom: 18,
                  borderRadius: 40,
                  height: 60,
                  width: 150,
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <AppText
                  style={{
                    color: "#47687F",
                    fontSize: 14,
                    alignSelf: "center",
                  }}
                >
                  Select Time
                </AppText>
                <Text
                  style={{
                    color: "rgba(21, 56, 95, 0.3)",
                    fontSize: 16,
                    padding: 2,
                    alignSelf: "center",
                    fontWeight: "700",
                  }}
                >
                  {date.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={"time"}
                  onChange={onChange}
                  neutralButtonLabel="clear"
                  placeholder="From"
                />
              )}
            </View>
          </>
        </Formik>
        <AppButton title="Submit Prescription" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: "#FFFFFF",
  },
});

export default AddPrescription;
