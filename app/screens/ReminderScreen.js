import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Feather from "react-native-vector-icons/Feather";
import * as Notifications from "expo-notifications";
import {
  getObjectData,
  getAllKeys,
  clearAll,
  removeValue,
} from "../components/utils/reminderStorage";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";
import RBSheet from "react-native-raw-bottom-sheet";
import LobbyReminder from "./LobbyReminder";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const ReminderScreen = ({ navigation }) => {
  const [todayReminders, setTodayReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const refRBSheet = useRef();

  const getReminders = async () => {
    const data = await getAllKeys();
    // console.log(data)

    if (data.length > 0) {
      data.forEach(async (dateTime) => {
        console.log("Dateime", dateTime);
        const date = dateTime.split("-")[0];
        if (date === new Date().toLocaleDateString()) {
          const rmr = await getObjectData(dateTime);
          todayReminders.push(rmr);
        } else {
          const rmr = await getObjectData(dateTime);
          upcomingReminders.push(rmr);
        }

        setTodayReminders([...Array.from(new Set(todayReminders))]);
        setUpcomingReminders([...new Set(upcomingReminders)]);
      });
    }
  };

  useEffect(() => {
    getReminders();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.container1}>
        {/* {todayReminders.length === 0 && upcomingReminders.length === 0 && (
          <AppText>There's no reminders found!</AppText>
        )} */}
        <Formik
          initialValues={{
            pet: "",
          }}
        >
          <ChoosePicker
            items={pet}
            label="Choose your pet"
            name="pet"
            placeholder="Choose your pet"
          />
        </Formik>
        <View>
          <View>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View
                style={{
                  backgroundColor: "#60E6A6",
                  borderRadius: 50,
                  height: 70,
                  width: 70,
                  justifyContent: "center",
                  left: 20,
                  bottom: 5,
                  elevation: 10,
                }}
              >
                <Feather
                  name={"calendar"}
                  size={35}
                  color={"white"}
                  style={{
                    alignSelf: "center",
                  }}
                />
              </View>
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    borderColor: "#B9C4CF",
                    borderWidth: 1,
                    marginBottom: 18,
                    borderRadius: 40,
                    height: 50,
                    width: 150,
                  }}
                >
                  <AppText
                    style={{
                      color: "#47687F",
                      alignSelf: "center",
                      fontSize: 14,
                    }}
                  >
                    April 11th, 2021
                  </AppText>
                </View>
                <View
                  style={{
                    borderColor: "#60E6A6",
                    borderWidth: 1,
                    marginBottom: 0,
                    borderRadius: 40,
                    height: 50,
                    width: 200,
                    justifyContent: "center",
                    backgroundColor: "#60E6A6",
                    flexDirection: "row",
                    elevation: 10,
                    bottom: 40,
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <AppText
                      style={{
                        color: "#FFFFFF",
                        alignSelf: "center",
                        fontSize: 12,
                        fontWeight: "700",
                      }}
                    >
                      Vaccination Day
                    </AppText>
                    <AppText
                      style={{
                        color: "#47687F",
                        alignSelf: "center",
                        fontSize: 14,
                        fontWeight: "400",
                        bottom: 10,
                      }}
                    >
                      Canine Distemper.
                    </AppText>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 50,
                      height: 40,
                      width: 40,
                      justifyContent: "center",
                      elevation: 10,
                      opacity: 0.6,
                      left: 5,
                      top: 4,
                    }}
                  >
                    <Image
                      source={require("../components/assets/images/Vaccine.png")}
                      style={{
                        alignSelf: "center",
                      }}
                    />
                  </View>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    paddingTop: 0,
                    marginBottom: 0,
                    marginHorizontal: 20,
                  }}
                  onPress={() => refRBSheet.current.open()}
                  // onPress={() =>
                  //   navigation.navigate("AddReminder", {
                  //     rmr: todayReminders,
                  //   })
                  // }
                >
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
                <RBSheet
                  ref={refRBSheet}
                  animationType="fade"
                  customStyles={{
                    wrapper: {
                      backgroundColor: "rgba(255, 255, 255, 0.92)",
                    },
                    draggableIcon: {
                      backgroundColor: "#000",
                    },
                    container: {
                      width: "90%",
                      height: "80%",
                      borderRadius: 25,
                      backgroundColor: "#FFFFFF",
                      elevation: 10,
                      justifyContent: "center",
                      alignSelf: "center",
                      alignContent: "center",
                      alignItems: "center",
                      bottom: 50,
                    },
                  }}
                >
                  <LobbyReminder />
                </RBSheet>
              </View>
            </View>
            <Image
              source={require("../components/assets/images/Dotline.png")}
              style={{ height: 50, left: 40 }}
            />
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#60E6A6",
                    borderRadius: 50,
                    height: 25,
                    width: 25,
                    justifyContent: "center",
                    elevation: 10,
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    alignSelf: "center",
                    margin: 5,
                  }}
                />
                <Text
                  style={{
                    color: "#47687F",
                    fontSize: 14,
                    fontWeightL: "400",
                    alignSelf: "center",
                  }}
                >
                  10:00 am
                </Text>
              </View>
              <View
                style={{
                  borderColor: "#FFFFFF",
                  borderWidth: 1,
                  marginBottom: 18,
                  borderRadius: 20,
                  height: 70,
                  width: 250,
                  alignSelf: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  margin: 10,
                  elevation: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flexDirection: "column", marginLeft: 15 }}>
                    <Text
                      style={{
                        color: "#47687F",
                        fontSize: 14,
                        fontWeightL: "400",
                      }}
                    >
                      Intas Eazypet
                    </Text>
                    <Text
                      style={{
                        color: "#B9C4CF",
                        fontSize: 11,
                        fontWeightL: "400",
                      }}
                    >
                      After Breakfast
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#41CE8A",
                      fontSize: 18,
                      fontWeight: "700",
                      flex: 1,
                      textAlign: "right",
                      marginRight: 15,
                    }}
                  >
                    1 No.
                  </Text>
                </View>
              </View>
            </View>
            <Image
              source={require("../components/assets/images/Dotline.png")}
              style={{ height: 50, left: 40 }}
            />
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#60E6A6",
                    borderRadius: 50,
                    height: 25,
                    width: 25,
                    justifyContent: "center",
                    elevation: 10,
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    alignSelf: "center",
                    margin: 5,
                  }}
                />
                <Text
                  style={{
                    color: "#47687F",
                    fontSize: 14,
                    fontWeightL: "400",
                    alignSelf: "center",
                  }}
                >
                  09:30 pm
                </Text>
              </View>
              <View
                style={{
                  borderColor: "#FFFFFF",
                  borderWidth: 1,
                  marginBottom: 18,
                  borderRadius: 20,
                  height: 70,
                  width: 250,
                  alignSelf: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  margin: 10,
                  elevation: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flexDirection: "column", marginLeft: 15 }}>
                    <Text
                      style={{
                        color: "#47687F",
                        fontSize: 14,
                        fontWeightL: "400",
                      }}
                    >
                      Himalaya Digyton Drop
                    </Text>
                    <Text
                      style={{
                        color: "#B9C4CF",
                        fontSize: 11,
                        fontWeightL: "400",
                      }}
                    >
                      After Breakfast
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#41CE8A",
                      fontSize: 18,
                      fontWeight: "700",
                      flex: 1,
                      textAlign: "right",
                      marginRight: 15,
                    }}
                  >
                    10ml
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {todayReminders.length > 0 && (
          <>
            <AppText>Today's Reminders</AppText>
            {todayReminders.map((rmr, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.innerCard}>
                  <AppText style={{ flex: 1 }}>{rmr.reminder}</AppText>
                  <Feather
                    name="trash-2"
                    size={22}
                    color="red"
                    style={styles.icon}
                    onPress={async () => {
                      await Notifications.cancelScheduledNotificationAsync(
                        rmr.identifier
                      );
                      const d = new Date(rmr.date);

                      await removeValue(
                        `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
                      );
                      todayReminders.splice(index, 1);
                      setTodayReminders([...todayReminders]);
                    }}
                  />
                </View>
              </View>
            ))}
          </>
        )}

        {upcomingReminders.length > 0 && (
          <>
            <AppText>Upcoming Reminders</AppText>
            {upcomingReminders.map((rmr, index) => (
              <View key={index} style={styles.card}>
                <AppText style={{ fontSize: 15 }}>
                  {rmr.endDate
                    ? rmr?.endDate?.split("T")[0]
                    : rmr?.date?.split("T")[0]}
                </AppText>
                <View style={styles.innerCard}>
                  <AppText style={{ flex: 1 }}>{rmr.reminder}</AppText>
                  <Feather
                    name="trash-2"
                    size={22}
                    color="red"
                    style={styles.icon}
                    onPress={async () => {
                      await Notifications.cancelScheduledNotificationAsync(
                        rmr.identifier
                      );
                      const d = new Date(rmr.date);

                      await removeValue(
                        `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
                      );
                      upcomingReminders.splice(index, 1);
                      setUpcomingReminders([...upcomingReminders]);
                    }}
                  />
                </View>
              </View>
            ))}
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
    marginVertical: 30,
    marginBottom: 80,
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 10,
  },
  innerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ReminderScreen;
