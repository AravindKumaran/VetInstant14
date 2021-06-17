import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Formik } from "formik";
import ReminderScreen from "./ReminderScreen";
import Feather from "react-native-vector-icons/Feather";
import RBSheet from "react-native-raw-bottom-sheet";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import AppFormField from "../components/forms/AppFormField";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const time = [
  { value: "Morning" },
  { value: "Afternoon" },
  { value: "Evening" },
];

const LobbyReminder = ({ route }) => {
  const [active, setActive] = useState("Reminder");
  const [touched, setTouched] = useState(false);
  const refRBSheet = useRef();
  const navigation = useNavigation();

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

  const toggleTouched = () => {
    setTouched(!touched);
  };

  const handleActive = (value) => {
    setActive(value);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{ marginVertical: 20 }}>
        {active === "Reminder" && (
          <View>
            <AppText
              style={{
                alignSelf: "center",
                color: "#47687F",
                size: 14,
                fontWeight: "400",
                marginBottom: 20,
              }}
            >
              Add Reminder
            </AppText>
            <TouchableOpacity
              style={styles.box}
              onPress={() => handleActive("Medication")}
            >
              <Text style={styles.text1}>Medication</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.box}
              onPress={() => handleActive("Vaccination")}
            >
              <Text style={styles.text1}>Vaccination</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.box}
              onPress={() => handleActive("Deworming")}
            >
              <Text style={styles.text1}>Deworming</Text>
            </TouchableOpacity>
          </View>
        )}
        {active === "Medication" && (
          <>
            <Formik
              initialValues={{
                pet: "",
              }}
            >
              <>
                <View style={styles.container1}>
                  <AppText
                    style={{
                      alignSelf: "center",
                      color: "#47687F",
                      size: 14,
                      fontWeight: "400",
                      marginBottom: 20,
                    }}
                  >
                    Add Medication
                  </AppText>
                  <AppFormField
                    label="Medicine name"
                    autoCapitalize="none"
                    autoCorrect={false}
                    name="Medicine name"
                    // placeholder="Medicine name"
                  />
                  <AppFormField
                    label="Doze"
                    autoCapitalize="none"
                    autoCorrect={false}
                    name="Doze"
                    // placeholder="Doze"
                  />

                  <View
                    style={{
                      top: 0,
                      width: "80%",
                      alignSelf: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      paddingTop: 10,
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
                        width: 130,
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
                        From
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
                      onPress={showDatepicker}
                      style={{
                        marginHorizontal: 20,
                        borderColor: "rgba(21, 56, 95, 0.3)",
                        borderWidth: 1,
                        marginBottom: 18,
                        borderRadius: 40,
                        height: 60,
                        width: 130,
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
                        To
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
                        placeholder="To"
                      />
                    )}
                  </View>
                  <AppText
                    style={{
                      color: "#47687F",
                      size: 14,
                      fontWeight: "400",
                    }}
                  >
                    Duration
                  </AppText>
                  <View
                    style={{
                      alignSelf: "center",
                      flexDirection: "row",
                      paddingTop: 10,
                      marginHorizontal: 20,
                    }}
                  >
                    <Feather
                      name={"sun"}
                      size={20}
                      color={"#B9C4CF"}
                      style={{ right: 20 }}
                    />
                    <Feather
                      name={"plus-circle"}
                      size={20}
                      color={"#B9C4CF"}
                      style={{}}
                    />
                    <Feather
                      name={"moon"}
                      size={20}
                      color={"#B9C4CF"}
                      style={{ left: 20 }}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      alignSelf: "center",
                      alignContent: "center",
                      paddingLeft: 10,
                      marginTop: 20,
                    }}
                  >
                    <RadioForm
                      radio_props={time}
                      initial={null}
                      formHorizontal={true}
                      labelHorizontal={true}
                      labelColor={"white"}
                      animation={true}
                      onPress={setisSelected}
                      buttonColor={"#B9C4CF"}
                      selectedButtonColor={"#60E6A6"}
                      buttonStyle={{ margin: 20 }}
                    />
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <AppFormField
                      label="Duration"
                      autoCapitalize="none"
                      autoCorrect={false}
                      name="Duration"
                      // placeholder="Duration"
                    />
                  </View>
                </View>
              </>
            </Formik>
            <AppButton title="Proceed to pay" />
          </>
        )}
        {active === "Vaccination" && (
          <>
            <Formik
              initialValues={{
                pet: "",
              }}
            >
              <>
                <View style={styles.container1}>
                  <AppText
                    style={{
                      alignSelf: "center",
                      color: "#47687F",
                      size: 14,
                      fontWeight: "400",
                      marginBottom: 20,
                    }}
                  >
                    Add Vaccination
                  </AppText>
                  <AppFormField
                    label="Vaccine name"
                    autoCapitalize="none"
                    autoCorrect={false}
                    name="Vaccine name"
                    // placeholder="Vaccine name"
                  />

                  <View
                    style={{
                      top: 0,
                      width: "80%",
                      alignSelf: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      paddingTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={showDatepicker}
                      style={{
                        borderColor: "rgba(21, 56, 95, 0.3)",
                        borderWidth: 1,
                        marginBottom: 10,
                        borderRadius: 40,
                        height: 60,
                        width: "125%",
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
                        Add Vaccination Date
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
                  </View>
                  <AppFormField
                    label="Description"
                    autoCapitalize="none"
                    autoCorrect={false}
                    name="Description"
                    // placeholder="Description"
                  />
                  <AppFormField
                    label="Quantity"
                    autoCapitalize="none"
                    autoCorrect={false}
                    name="Quantity"
                    // placeholder="Quantity"
                  />
                </View>
              </>
            </Formik>
            <AppButton title="Proceed to pay" />
          </>
        )}
        {active === "Deworming" && (
          <>
            <Formik
              initialValues={{
                pet: "",
              }}
            >
              <>
                <View style={styles.container1}>
                  <AppText
                    style={{
                      alignSelf: "center",
                      color: "#47687F",
                      size: 14,
                      fontWeight: "400",
                      marginBottom: 20,
                    }}
                  >
                    Add Deworming
                  </AppText>
                </View>
              </>
            </Formik>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  box: {
    height: 50,
    width: 300,
    borderRadius: 30,
    marginVertical: 20,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B9C4CF",
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    alignSelf: "center",
  },
  text2: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 24,
    color: "#41CE8A",
    marginBottom: 20,
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  text4: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 14,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
});

export default LobbyReminder;
