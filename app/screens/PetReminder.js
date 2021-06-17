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

const PetReminder = ({ navigation, route }) => {
  const [active, setActive] = useState("Profile");
  const [touched, setTouched] = useState(false);
  const refRBSheet = useRef();

  const toggleTouched = () => {
    setTouched(!touched);
  };

  const handleActive = (value) => {
    setActive(value);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginVertical: 20 }}>
        <TouchableOpacity
        //   onPress={() =>
        //     navigation.navigate("AddReminder", {
        //       rmr: todayReminders,
        //     })
        //   }
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
              marginBottom: 20,
            }}
          />
        </TouchableOpacity>
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
          <Image
            source={require("../components/assets/images/medicineimage.png")}
            style={{ height: 100, width: 100 }}
          />
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: "#47687F",
                fontWeight: "700",
              }}
            >
              Take up Vitamin Suppliment a...
            </Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Feather name={"clock"} size={20} color={"#69EEAE"} />
              <Text
                style={{
                  color: "#47687F",
                  fontWeight: "400",
                  marginLeft: 5,
                }}
              >
                Daily / 10AM , 2PM, 8PM
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            style={{ flex: 1, alignItems: "flex-end", marginRight: 10 }}
          >
            <Feather name={"more-horizontal"} size={20} color={"#47687F"} />
          </TouchableOpacity>
          <RBSheet
            ref={refRBSheet}
            height={200}
            animationType="fade"
            customStyles={{
              wrapper: {
                backgroundColor: "rgba(255, 255, 255, 0.92)",
              },
              draggableIcon: {
                backgroundColor: "#000",
              },
              container: {
                backgroundColor: "#FFFFFF",
                borderRadius: 25,
                bottom: 250,
                width: "90%",
                alignSelf: "center",
                elevation: 10,
              },
            }}
          >
            {touched ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Image
                    source={require("../components/assets/images/medicineimage.png")}
                    style={{ height: 100, width: 100 }}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                      width: "60%",
                    }}
                  >
                    <Text
                      style={{
                        color: "#47687F",
                        fontWeight: "700",
                        marginBottom: 10,
                      }}
                    >
                      Take up Vitamin Suppliment and the Digestion pills
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <Feather name={"clock"} size={20} color={"#69EEAE"} />
                      <Text
                        style={{
                          color: "#47687F",
                          fontWeight: "400",
                          marginHorizontal: 5,
                        }}
                      >
                        Daily / 10AM , 2PM, 8PM
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setTouched(!touched)}
                    style={{ flex: 1, alignItems: "flex-end", marginRight: 20 }}
                  >
                    <Feather
                      name={"more-horizontal"}
                      size={25}
                      color={"#47687F"}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#F3F4F4",
                      width: "100%",
                    }}
                  />
                  <TouchableOpacity>
                    <Text
                      style={{
                        color: "#47687F",
                        fontWeight: "400",
                        fontSize: 14,
                        marginVertical: 10,
                      }}
                    >
                      Edit Reminder
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text
                      style={{
                        color: "#FF6464",
                        fontWeight: "400",
                        fontSize: 14,
                        marginVertical: 10,
                      }}
                    >
                      Delete Reminder
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Image
                    source={require("../components/assets/images/medicineimage.png")}
                    style={{ height: 100, width: 100 }}
                  />
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        color: "#47687F",
                        marginHorizontal: 10,
                        fontWeight: "700",
                      }}
                    >
                      Medicine Reminder
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setTouched(!touched)}
                    style={{ flex: 1, alignItems: "flex-end", marginRight: 20 }}
                  >
                    <Feather
                      name={"more-horizontal"}
                      size={25}
                      color={"#47687F"}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#F3F4F4",
                      width: "100%",
                    }}
                  />
                  <Text
                    style={{
                      color: "#47687F",
                      fontWeight: "700",
                      margin: 10,
                      fontSize: 14,
                    }}
                  >
                    Take up Vitamin Suppliment and the Digestion pills
                  </Text>
                  <View
                    style={{
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Feather name={"clock"} size={20} color={"#69EEAE"} />
                    <Text
                      style={{
                        color: "#47687F",
                        fontWeight: "400",
                        marginHorizontal: 5,
                      }}
                    >
                      Daily / 10AM , 2PM, 8PM
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </RBSheet>
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
          <Image
            source={require("../components/assets/images/vaccineimage.png")}
            style={{ height: 100, width: 100 }}
          />
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: "#47687F",
                fontWeight: "700",
              }}
            >
              Get DHLPP Vaccine
            </Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Feather name={"clock"} size={20} color={"#69EEAE"} />
              <Text
                style={{
                  color: "#47687F",
                  fontWeight: "400",
                  marginLeft: 5,
                }}
              >
                01-07-2021 / 10AM
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            style={{ flex: 1, alignItems: "flex-end", marginRight: 10 }}
          >
            <Feather name={"more-horizontal"} size={20} color={"#47687F"} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
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
  box: {
    height: 50,
    borderRadius: 30,
    marginVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    elevation: 10,
    backgroundColor: "#FFFFFF",
    margin: 20,
  },
});

export default PetReminder;
