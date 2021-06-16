import React, { useState, useEffect, useRef } from "react";

import { Image, StyleSheet, View, Text, Dimensions } from "react-native";
import AppText from "../components/AppText";

import petsApi from "../api/pets";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import LoadingIndicator from "../components/LoadingIndicator";

import Feather from "react-native-vector-icons/Feather";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";

import RBSheet from "react-native-raw-bottom-sheet";
import AppFormField from "../components/forms/AppFormField";
import AppButton from "../components/AppButton";
import AddPrescription from "../screens/AddPrescription";
import AddReminderScreen from "../screens/AddReminderScreen";
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
  { label: "Morning", value: "Morning" },
  { label: "Afternoon", value: "Afternoon" },
  { label: "Night", value: "Night" },
];

const times = [
  { value: "Morning" },
  { value: "Afternoon" },
  { value: "Evening" },
];

const doctors = [
  {
    src: require("../components/assets/images/doctor1.png"),
    srcc: require("../components/assets/images/doctor2.png"),
    name: "Dr. Bottowski",
    time: "11th April 07:00 pm",
    hospital: "PetCare Veteneriary Hospital",
    amount: "$20",
  },
];

const PetPrescriptionScreen = ({ route }) => {
  const [petPrescriptions, setPetPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [isSelected, setisSelected] = useState(false);

  const refRBSheet = useRef();

  useEffect(() => {
    const getPetPrescriptions = async () => {
      setLoading(true);
      const res = await petsApi.getSinglePet(route?.params?.id);
      if (!res.ok) {
        setError(res.data.msg);
        setLoading(false);
        console.log(res);
        return;
      }
      setError(null);
      console.log("ResPEt", res.data.exPet.prescriptions);
      setPetPrescriptions(res.data.exPet.prescriptions);
      setLoading(false);
    };

    getPetPrescriptions();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <LoadingIndicator visible={loading} />
        {petPrescriptions.length === 0 ? (
          // <AppText style={{ textAlign: "center" }}>
          //   No Prescriptions Found
          // </AppText>
          <View>
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
            <View
              style={{
                borderWidth: 1,
                borderColor: "#B9C4CF",
                borderRadius: 20,
                height: 110,
                width: "95%",
                alignSelf: "center",
                padding: 10,
                marginVertical: 20,
              }}
            >
              <AppText
                style={{ textAlign: "center", fontSize: 14, color: "#47687F" }}
              >
                Prescriptions from the vets coming through VetInstant would be
                automatically updated here but for prescriptions from externall
                sources, you can add your prescriptions manually.
              </AppText>
              <TouchableOpacity onPress={() => refRBSheet.current.open()}>
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
                    backgroundColor: "#FFFFFF",
                    borderTopRightRadius: 25,
                    borderTopLeftRadius: 25,
                  },
                }}
              >
                <AddPrescription />
              </RBSheet>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#DCE1E7",
                  marginTop: 15,
                }}
              />
            </View>
            <View
              style={{
                borderRadius: 20,
                height: 200,
                marginVertical: 40,
                width: "95%",
                alignSelf: "center",
                elevation: 10,
                backgroundColor: "#FFFFFF",
              }}
            >
              <View style={{ marginTop: 15 }}>
                {doctors.map((c, i) => (
                  <>
                    <View key={`${c.name}-${i}`} style={styles.catItem}>
                      <Image
                        source={c.src}
                        size={15}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 30,
                          borderWidth: 2.5,
                          borderColor: "#FFFFFF",
                          padding: 10,
                        }}
                      />
                      <Image
                        source={c.srcc}
                        size={15}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 30,
                          borderWidth: 2.5,
                          borderColor: "#FFFFFF",
                          padding: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: 10,
                        }}
                      >
                        <Text style={styles.text1}>{c.name}</Text>
                        <Text style={styles.text3}>{c.time}</Text>
                        <Text style={styles.text2}>{c.hospital}</Text>
                      </View>
                    </View>
                  </>
                ))}
              </View>
              <View style={{ paddingVertical: 30 }}>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                  <AppText
                    style={{
                      color: "#47687F",
                      fontWeight: "400",
                      fontSize: 12,
                      marginLeft: 10,
                    }}
                  >
                    Intas Eazypet
                  </AppText>
                  <View
                    style={{
                      marginLeft: 150,
                      position: "absolute",
                    }}
                  >
                    <RadioForm
                      radio_props={times}
                      initial={null}
                      formHorizontal={true}
                      labelHorizontal={true}
                      labelColor={"white"}
                      animation={true}
                      onPress={setisSelected}
                      buttonColor={"#B9C4CF"}
                      selectedButtonColor={"#60E6A6"}
                      buttonSize={10}
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: 250,
                      position: "absolute",
                    }}
                  >
                    <Text style={{ color: "#47687F", fontWeight: "400" }}>
                      1 No.
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <AppText
                    style={{
                      color: "#47687F",
                      fontWeight: "400",
                      fontSize: 12,
                      marginLeft: 10,
                    }}
                  >
                    Himalaya Digyton Dr...
                  </AppText>
                  <View
                    style={{
                      marginLeft: 150,
                      position: "absolute",
                    }}
                  >
                    <RadioForm
                      radio_props={times}
                      initial={null}
                      formHorizontal={true}
                      labelHorizontal={true}
                      labelColor={"white"}
                      animation={true}
                      onPress={setisSelected}
                      buttonColor={"#B9C4CF"}
                      selectedButtonColor={"#60E6A6"}
                      buttonSize={10}
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: 250,
                      position: "absolute",
                    }}
                  >
                    <Text style={{ color: "#47687F", fontWeight: "400" }}>
                      10 ml
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <>
            {petPrescriptions.map((pbm, index) => (
              <View key={index} style={styles.card}>
                <AppText>Prescription: {pbm.prescription}</AppText>
                <AppText>Doctor Name: {pbm.docname}</AppText>
                <AppText>
                  Date: {new Date(pbm.date).toLocaleDateString()}
                </AppText>
                <AppText>
                  Time: {new Date(pbm.date).toLocaleTimeString()}
                </AppText>
                {pbm.img && (
                  <>
                    <AppText>Prescription Image:</AppText>
                    <Image
                      source={{
                        uri: `${pbm.img}`,
                      }}
                      // source={{
                      //   uri: `https://vetinstantbe.azurewebsites.net/img/${pbm.img}`,
                      // }}
                      style={{ width: 150, height: 150, borderRadius: 75 }}
                    />
                  </>
                )}
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
  },
  card: {
    backgroundColor: "red",
    marginVertical: 10,
    padding: 20,
    borderRadius: 5,
  },
  catItem: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    alignSelf: "center",
    justifyContent: "center",
  },
  catItem1: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
    borderWidth: 1,
    borderColor: "#B9C4CF",
    borderRadius: 30,
    height: 60,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#47687F",
  },
  text2: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 12,
    color: "#839BAB",
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 20,
    color: "#47687F",
    marginLeft: 70,
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 12,
    color: "#A3B1BF",
  },
});

export default PetPrescriptionScreen;
