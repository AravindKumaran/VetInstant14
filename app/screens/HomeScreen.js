import React, { useContext, useState, useEffect, useRef } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  Image,
  Text,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AuthContext from "../context/authContext";
import authStorage from "../components/utils/authStorage";
import AddPetButton from "../components/AddPetButton";
import LoadingIndicator from "../components/LoadingIndicator";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import petsApi from "../api/pets";
import usersApi from "../api/users";

import {
  getAllKeys,
  getObjectData,
  removeValue,
} from "../components/utils/reminderStorage";

import RBSheet from "react-native-raw-bottom-sheet";
import ChooseVetScreen from "../screens/ChooseVetScreen";
import MyVetScreen from "../screens/MyVetScreen";
import ScheduledCallScreen from "../screens/ScheduledCallScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HomeScreen = ({ navigation, route }) => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [rmr, setRmr] = useState([]);
  const [todayReminders, setTodayReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [ispet, setPet] = useState(true);
  const [isvet, setVet] = useState(false);
  const [active, setActive] = useState("pet");

  const refRBSheet = useRef();

  const handleActive = (value) => {
    setActive(value);
  };

  const isFocused = useIsFocused();

  const getAllPets = async () => {
    setLoading(true);
    const res = await petsApi.getPets();
    if (!res.ok) {
      setLoading(false);
      console.log(res);
    }
    setLoading(false);
    setPets(res.data.pets);
  };

  useEffect(() => {
    getAllPets();
  }, [isFocused]);

  useEffect(() => {
    const getAllRmr = async () => {
      const data = await getAllKeys();
      // console.log(data)
      setRmr(data);
    };

    getAllRmr();
  }, [isFocused]);

  useEffect(() => {
    const removePreviousAndGetReminders = async () => {
      if (rmr.length > 0) {
        const tr = [];
        const upr = [];
        rmr.forEach(async (dateTime) => {
          const date = dateTime.split("-")[0];
          const prevDate = new Date(date).getDate();
          const today = new Date().getDate();
          const rmr = await getObjectData(dateTime);
          if (
            prevDate < today ||
            (today === 1 && prevDate === 31) ||
            (today === 1 && prevDate === 30)
          ) {
            await Notifications.cancelScheduledNotificationAsync(
              rmr.identifier
            );
            await removeValue(dateTime);
          } else if (date === new Date().toLocaleDateString()) {
            tr.push(rmr);
          } else {
            upr.push(rmr);
          }
          setTodayReminders(tr);
          setUpcomingReminders(upr);
        });
      }
    };
    removePreviousAndGetReminders();
  }, [rmr.length]);

  const handleLogout = () => {
    setUser();
    authStorage.removeToken();
  };

  const sendPushToken = async (token, message, status) => {
    setLoading(true);

    const pushRes = await usersApi.sendPushNotification({
      targetExpoPushToken: token,
      title: "PetOwner Response!",
      message: message,
      datas: { tokenn: user.token || null, status: status || null },
    });
    if (!pushRes.ok) {
      setLoading(false);
      console.log("Error", pushRes);
      return;
    }
    setLoading(false);
    if (status === "ok") {
      alert(
        "Wait For Doctor Notification To Continue Further, Don't Close The App From Background. "
      );
    }
  };

  useEffect(() => {
    const saveNotificationToken = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== "granted") {
        alert("No Notification Permissions");
        return;
      }
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          experienceId: `@vetinstant/vetInstant`,
        });

        // console.log(token.data)

        if (user.token && user.token === token.data) {
          return;
        }

        const res = await usersApi.createPushToken({ token: token.data });
        if (!res.ok) {
          console.log("Error", res.data);
          return;
        }

        setUser(res.data.user);
      } catch (error) {
        console.log("Error getting push token", error);
      }
    };
    saveNotificationToken();
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  }, []);

  const doctors = [
    {
      src: require("../components/assets/images/doctor1.png"),
      name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
    },
    {
      src: require("../components/assets/images/doctor2.png"),
      name: "Your chat with Dr. R. Vijayashanthini has ended.",
    },
    {
      src: require("../components/assets/images/doctor1.png"),
      name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
    },
    {
      src: require("../components/assets/images/doctor2.png"),
      name: "Your chat with Dr. R. Vijayashanthini has ended.",
    },
  ];

  return (
    <ScrollView
      vertical={true}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <LoadingIndicator visible={loading} />
      <View style={styles.container1}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginHorizontal: 60,
          }}
        >
          <TouchableOpacity onPress={() => handleActive("pet")}>
            <AppText
              style={{
                fontWeight: "500",
                fontSize: 16,
                color: active === "pet" ? "#41CE8A" : "#476880",
              }}
            >
              Pets
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleActive("vet")}
            // onPress={() => refRBSheet.current.open()}
          >
            <AppText
              style={{
                fontWeight: "500",
                fontSize: 16,
                color: active === "vet" ? "#41CE8A" : "#476880",
              }}
            >
              Vet
            </AppText>
          </TouchableOpacity>

          <RBSheet
            ref={refRBSheet}
            height={Dimensions.get("window").height - 200}
            animationType="fade"
            closeOnDragDown={true}
            customStyles={{
              wrapper: {
                backgroundColor: "rgba(0,0,0,.6)",
              },
              draggableIcon: {
                backgroundColor: "#C4C4C4",
              },
              container: {
                backgroundColor: "#EBEBEB",
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
              },
            }}
          >
            <MyVetScreen />
          </RBSheet>
        </View>

        {active === "pet" && (
          <>
            <View style={styles.addPetContainer}>
              {loading ? (
                <LoadingIndicator visible={loading} />
              ) : (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {pets.length > 0 &&
                    pets.map((pet) => (
                      <AddPetButton
                        key={pet._id}
                        name={pet.name}
                        img={pet.photo}
                        onPress={() =>
                          navigation.navigate("ChooseVet", { pet })
                        }
                      />
                    ))}

                  <AddPetButton
                    title="+"
                    onPress={() => navigation.navigate("AddPet")}
                  />
                </ScrollView>
              )}
            </View>

            {pets.length > 0 ? (
              <></>
            ) : (
              <AppText
                style={{ fontSize: 20, color: "#47687F", textAlign: "center" }}
              >
                Add your vet
              </AppText>
            )}

            <View
              style={{
                height: 1,
                width: "95%",
                borderWidth: 1,
                borderColor: "#DCE1E7",
                alignSelf: "center",
                marginVertical: 20,
              }}
            />
            <View style={styles.rmdText}>
              <AppText style={{ fontSize: 20 }}>Reminders</AppText>
              <TouchableOpacity
                style={styles.editWrapper}
                onPress={() => navigation.navigate("Reminder")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Feather name="edit" size={24} color="#47687F" />
                  <AppText style={{ fontSize: 16 }}>EDIT</AppText>
                </View>
              </TouchableOpacity>
            </View>

            {upcomingReminders.length === 0 && todayReminders.length === 0 && (
              <AppText style={{ textAlign: "center", fontSize: 20 }}>
                No Reminders Found
              </AppText>
            )}
            {todayReminders.length > 0 && (
              <>
                <View style={styles.rmrCard}>
                  <AppText style={{ fontSize: 20, color: "#606770" }}>
                    Today's Reminders
                  </AppText>
                  {todayReminders.map((rmr, i) => (
                    <AppText key={rmr.identifier} style={styles.rmrText}>
                      {i + 1}) {rmr.reminder}
                    </AppText>
                  ))}
                </View>
              </>
            )}
            {upcomingReminders.length > 0 && (
              <>
                <View style={styles.rmrCard}>
                  <AppText style={{ fontSize: 20, color: "#606770" }}>
                    Upcoming Reminders
                  </AppText>
                  {upcomingReminders.map((rmr, i) => (
                    <AppText key={rmr.identifier} style={styles.rmrText}>
                      {i + 1}) {rmr.reminder}
                    </AppText>
                  ))}
                </View>
              </>
            )}
          </>
        )}

        {active === "vet" && (
          <>
            <View style={styles.addPetContainer}>
              {loading ? (
                <LoadingIndicator visible={loading} />
              ) : (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {vets.length > 0 &&
                    vets.map((vet) => (
                      <AddPetButton
                        key={vet._id}
                        name={vet.name}
                        img={vet.photo}
                        onPress={() =>
                          navigation.navigate("ChooseVet", { vet })
                        }
                      />
                    ))}

                  <AddPetButton
                    title="+"
                    onPress={() => navigation.navigate("MyVet")}
                  />
                </ScrollView>
              )}
            </View>

            {vets.length > 0 ? (
              <></>
            ) : (
              <AppText
                style={{ fontSize: 20, color: "#47687F", textAlign: "center" }}
              >
                Add your vet
              </AppText>
            )}

            <View
              style={{
                height: 1,
                width: "95%",
                borderWidth: 1,
                borderColor: "#DCE1E7",
                alignSelf: "center",
                marginVertical: 20,
              }}
            />
            <ScheduledCallScreen />
            {/* <View style={{ paddingTop: 10 }}>
              {doctors.map((c, i) => (
                <>
                  <View key={`${c.name}-${i}`} style={styles.catItem}>
                    <Image
                      source={c.src}
                      size={15}
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: 50,
                        borderWidth: 10,
                        borderColor: "#FFFFFF",
                        // resizeMode: "contain",
                      }}
                    />
                    <Text style={[styles.catItemText, { marginTop: -10 }]}>
                      {c.name}
                    </Text>
                    <View style={styles.Rectangle}>
                      <TouchableOpacity>
                        <Text style={styles.text1}>Proceed</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "95%",
                      borderWidth: 1,
                      borderColor: "#DCE1E7",
                      alignSelf: "center",
                      marginVertical: 15,
                      bottom: 20,
                    }}
                  />
                </>
              ))}
            </View> */}
          </>
        )}

        {/* <View style={{ paddingTop: 10 }}>
          {doctors.map((c, i) => (
            <>
              <View key={`${c.name}-${i}`} style={styles.catItem}>
                <Image
                  source={c.src}
                  size={15}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                    borderWidth: 10,
                    borderColor: "#FFFFFF",
                    // resizeMode: "contain",
                  }}
                />
                <Text style={[styles.catItemText, { marginTop: -10 }]}>
                  {c.name}
                </Text>
                <View style={styles.Rectangle}>
                  <TouchableOpacity>
                    <Text style={styles.text1}>Proceed</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  width: "95%",
                  borderWidth: 1,
                  borderColor: "#DCE1E7",
                  alignSelf: "center",
                  marginVertical: 15,
                  bottom: 20,
                }}
              />
            </>
          ))}
        </View> */}

        {/* <View style={{ marginBottom: 50 }}>
          <AppText style={{ textAlign: "center" }}>
            {user ? user.emailID || user.email : ""}
          </AppText>
          <AppButton title="Logout" onPress={handleLogout} />
          <AppButton title='Token' onPress={sendPushToken} />
        </View> */}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 50,
  },
  addPetContainer: {
    width: "100%",
    flexDirection: "row",
  },
  bottomCard: {
    marginVertical: 15,
    backgroundColor: "#32a852",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  rmdText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    marginHorizontal: 3,
  },
  editWrapper: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    borderRadius: 10,
    paddingLeft: 10,
    elevation: 5,
  },
  rmrCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
    marginVertical: 15,
    elevation: 10,
  },
  rmrText: {
    fontSize: 16,
    paddingBottom: 5,
    paddingLeft: 15,
  },
  catItem: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
  },
  catItemText: {
    color: "#47687F",
    fontWeight: "400",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    marginRight: 180,
  },
  Rectangle: {
    width: 80,
    height: 30,
    backgroundColor: "#f3f3f3",
    borderRadius: 20,
    right: 170,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#51DA98",
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 12,
    color: "#51DA98",
  },
});

export default HomeScreen;
