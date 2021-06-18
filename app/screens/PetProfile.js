import React, { useState, useEffect } from "react";
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
import PetReminder from "./PetReminder";

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

const PetProfile = ({ navigation, route }) => {
  const [active, setActive] = useState("Profile");

  const handleActive = (value) => {
    setActive(value);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Formik
        initialValues={{
          reminder: "",
        }}
      >
        <>
          <View style={{ marginVertical: 20, marginBottom: 80 }}>
            <Image
              style={{
                height: 130,
                width: 130,
                alignSelf: "center",
                borderRadius: 100,
                borderWidth: 10,
                borderColor: "#FFFFFF",
                elevation: 10,
              }}
              source={require("../components/assets/images/dogimage.png")}
            />
            <Text style={{ textAlign: "center" }}>
              <Text style={styles.text2}>Bruno</Text>{" "}
              <Text
                style={[
                  styles.text2,
                  { color: "#47687F", fontSize: 18, fontWeight: "400" },
                ]}
              >
                (Dog)
              </Text>
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#47687F",
                fontSize: 14,
                fontWeight: "400",
                marginBottom: 20,
              }}
            >
              Fun and games lover
            </Text>
            <TouchableOpacity
              style={{
                height: 40,
                width: "80%",
                borderWidth: 1,
                borderColor: "#41CE8A",
                borderRadius: 30,
                justifyContent: "center",
                alignSelf: "center",
              }}
              // onPress={() => {
              //   navigation.navigate("PetScreen");
              // }}
              onPress={() =>
                navigation.navigate("AddPet", {
                  pet: route.params?.pet,
                  editPet: true,
                })
              }
            >
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "700",
                  alignSelf: "center",
                }}
              >
                Edit pet profile
              </Text>
            </TouchableOpacity>
            <View style={styles.choose}>
              <View>
                {active === "Profile" ? <ActiveStyle /> : <View />}
                <TouchableWithoutFeedback
                  onPress={() => handleActive("Profile")}
                >
                  <Text
                    style={[
                      styles.text1,
                      { color: active === "Profile" ? "#41CE8A" : "#476880" },
                    ]}
                  >
                    Profile
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View>
                {active === "Reminders" ? <ActiveStyle /> : <View />}
                <TouchableWithoutFeedback
                  onPress={() => handleActive("Reminders")}
                >
                  <Text
                    style={[
                      styles.text1,
                      { color: active === "Reminders" ? "#41CE8A" : "#476880" },
                    ]}
                  >
                    Reminders
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {active === "Profile" && (
              <View>
                <View style={styles.box}>
                  <Text style={styles.text3}>Breed</Text>
                  <Text style={styles.text4}>Shiba Inu</Text>
                </View>
                <View style={styles.box}>
                  <Text style={styles.text3}>Age</Text>
                  <Text style={styles.text4}>2 Yrs. 1 Mo.</Text>
                </View>
                <View style={styles.box}>
                  <Text style={styles.text3}>D.O.B</Text>
                  <Text style={styles.text4}>14-06-2019</Text>
                </View>
                <View style={styles.box}>
                  <Text style={styles.text3}>Gender</Text>
                  <Text style={styles.text4}>Male</Text>
                </View>
              </View>
            )}
            {/* {active === "Reminders" && <ReminderScreen />} */}
            {active === "Reminders" && <PetReminder />}
          </View>
        </>
      </Formik>
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

export default PetProfile;
