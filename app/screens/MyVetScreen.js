import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AuthContext from "../context/authContext";

import hospitalsApi from "../api/hospitals";
import doctorsApi from "../api/doctors";
import LoadingIndicator from "../components/LoadingIndicator";

import ChooseVetPicker from "../components/forms/ChooseVetPicker";
import { Formik } from "formik";

const reminders = [
  { label: "Deworming", value: "Deworming" },
  { label: "Medicine", value: "Medicine" },
  { label: "Vaccine", value: "Vaccine" },
];

const MyVetScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const { hospitalId, doctorId } = user;

  const [docDetail, setDocDetail] = useState();
  const [hospDetail, setHospDetail] = useState();
  const [loading, setLoading] = useState(false);

  const getDoctorAndHospital = async (hospitalId, doctorId) => {
    setLoading(true);
    const hospRes = await hospitalsApi.getSingleHospital(hospitalId);

    if (!hospRes.ok) {
      setLoading(false);
      console.log(hospRes);
      return;
    }

    const docRes = await doctorsApi.getSingleDoctor(doctorId);
    if (!docRes.ok) {
      setLoading(false);
      console.log(docRes);
      return;
    }

    setDocDetail(docRes.data.doctor);
    setHospDetail(hospRes.data.hospital);
    setLoading(false);
  };

  useEffect(() => {
    if (hospitalId) {
      getDoctorAndHospital(hospitalId, doctorId);
    }
  }, [hospitalId, doctorId]);

  const doctors = [
    {
      src: require("../../assets/doctor1.png"),
      name: "Dr. Bottowski",
      hospital: "PetCare Veteneriary Hospital",
      amount: "$20",
    },
    {
      src: require("../../assets/doctor2.png"),
      name: "Dr. Bottowski",
      hospital: "VetPlus Veteneriary Hospital",
      amount: "$20",
    },
    {
      src: require("../../assets/doctor1.png"),
      name: "Dr. Bottowski",
      hospital: "PetCare Veteneriary Hospital",
      amount: "$20",
    },
    {
      src: require("../../assets/doctor2.png"),
      name: "Dr. Bottowski",
      hospital: "VetPlus Veteneriary Hospital",
      amount: "$20",
    },
  ];

  return (
    <>
      {loading ? (
        <LoadingIndicator visible={loading} />
      ) : (
        <View style={styles.container}>
          {docDetail && hospDetail ? (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  marginBottom: 50,
                  marginTop: 20,
                  color: "#47687F",
                }}
              >
                Choose your vet
              </AppText>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  borderWidth: 2,
                  borderColor: "#B9C4CF",
                  borderRadius: 25,
                  bottom: 20,
                }}
              >
                <Formik
                  initialValues={{
                    reminder: "",
                  }}
                >
                  <>
                    <ChooseVetPicker
                      items={reminders}
                      label="Type Of Reminder"
                      name="reminder"
                    />
                    <AppText
                      style={{
                        textAlign: "left",
                        fontSize: 14,
                        marginBottom: 20,
                        marginTop: 20,
                        color: "#47687F",
                        paddingHorizontal: 15,
                      }}
                    >
                      My vets
                    </AppText>
                    {/* <View style={styles.card}>
                      <AppText style={{ fontSize: 14, color: "#606770" }}>
                        Doctor Name :
                      </AppText>
                      <AppText>{docDetail.user.name}</AppText>
                    </View>
                    <View style={styles.card}>
                      <AppText style={{ fontSize: 14, color: "#606770" }}>
                        Hospital Name :
                      </AppText>
                      <AppText>{hospDetail.name}</AppText>
                    </View> */}
                    <View style={{ paddingTop: 10 }}>
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
                              }}
                            />
                            <View style={{ flexDirection: "column" }}>
                              <Text>{c.name}</Text>
                              <Text>{c.hospital}</Text>
                            </View>
                            <View style={styles.Rectangle}>
                              <TouchableOpacity>
                                <Text style={styles.text1}>{c.amount}</Text>
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
                    </View>
                    <AppButton
                      title="Change Vet"
                      onPress={() =>
                        navigation.navigate("SaveVet", {
                          hosp: hospDetail,
                          doc: docDetail,
                          title: "Edit Vet Details",
                        })
                      }
                    />
                  </>
                </Formik>
              </ScrollView>
            </>
          ) : (
            <>
              <AppText style={{ fontSize: 22, marginVertical: 30 }}>
                You haven't added any vet
              </AppText>
              <AppButton
                title="Add Vet"
                onPress={() => navigation.navigate("SaveVet")}
              />
            </>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 15,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
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
    right: 0,
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

export default MyVetScreen;
