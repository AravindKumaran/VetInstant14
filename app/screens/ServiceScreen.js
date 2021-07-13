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
import petsApi from "../api/pets";
import roomsApi from "../api/rooms";
import LoadingIndicator from "../components/LoadingIndicator";
import { useNavigation } from "@react-navigation/native";
import ChooseVetPicker from "../components/forms/ChooseVetPicker";
import { Formik } from "formik";

const vet = [
  { label: "Buttowski", value: "Buttowski" },
  { label: "Ramsay", value: "Ramsay" },
  { label: "Mariam", value: "Mariam" },
];

const sdoctors = [
  {
    src: require("../components/assets/images/doctor1.png"),
    name: "Dr. Bottowski",
    hospital: "PetCare Veteneriary Hospital",
    amount: "₹200",
  },
];

const ServiceScreen = ({ onClosePress }) => {
  const { user } = useContext(AuthContext);

  const { hospitalId, doctorId } = user;

  const navigation = useNavigation();
  let [doctor, setDoctor] = useState([]);

  const [docDetailFromSameHospitals, setDocDetailFromSameHospitals] = useState(
    {}
  );
  const [onlineAvailableVetDoctor, setOnlineAvailableVetDoctor] = useState();
  const [loading, setLoading] = useState(false);
  let [selectedDoctor, setSelectedDoctor] = useState([]);
  let [pets, setPets] = useState([]);

  const [active, setActive] = useState("stepone");

  const handleActive = (value) => {
    setActive(value);
  };
  const getOnlineAvailableVetDoctors = async () => {
    setLoading(true);
    const onlineAvailableVet = await doctorsApi.getOnlineDoctors();

    if (!onlineAvailableVet.ok) {
      setLoading(false);
      console.log("response no ok");
      return;
    }
    const onlineVet = onlineAvailableVet?.data?.onlineDoctor.find(
      (doc) => doc.firstAvailaibeVet
    );
    console.log("onlineVet", onlineVet);
    setOnlineAvailableVetDoctor(onlineVet);
    setLoading(false);
  };

  const getDocFromSameHospitals = async (hospitalId, doctorId) => {
    setLoading(true);
    const otherDocsFromHospitals =
      await hospitalsApi.getOtherDoctorsFromHospital(hospitalId, doctorId);
    console.log(
      "otherDocsFromHospitals",
      otherDocsFromHospitals.data.onlineDoc
    );
    // const allDocSameHos = await hospitalsApi.getHospitalsDoctors(hospitalId);
    if (!otherDocsFromHospitals.ok) {
      setLoading(false);
      console.log("response no ok");
      return;
    }
    setDocDetailFromSameHospitals(otherDocsFromHospitals.data.onlineDoc);
  };

  const getAllPets = async () => {
    setLoading(true);
    const allPets = await petsApi.getPets();
    console.log("allPets", allPets.data.pets);
    if (!allPets.ok) {
      setLoading(false);
      console.log("response no ok");
      return;
    }
    setPets(allPets.data.pets);
    setLoading(false);
  };
  useEffect(() => {
    const getAllDoctors = async () => {
      setLoading(true);
      const allDoctors = await doctorsApi.getAllDoctors();

      if (!allDoctors.ok) {
        setLoading(false);
        console.log("response no ok");
        return;
      }

      setDoctor(allDoctors.data.doctors);
      setLoading(false);
    };
    getAllDoctors();
    getAllPets();
    getOnlineAvailableVetDoctors();
    console.log("user", user);
    console.log("selectedDoctor", selectedDoctor);
  }, []);
  const createRoomForChat = async (docDetails, petDetails) => {
    const roomRes = await roomsApi.createRoom({
      name: `${user._id}-${docDetails._id}`,
      senderName: user.name,
      receiverId: docDetails._id,
      petId: petDetails._id,
    });
    if (!roomRes.ok) {
      console.log(roomRes);
      setLoading(false);
      return;
    } else {
      navigation.navigate("Room", {
        docDetails: docDetails,
        petDetails: petDetails,
        video: false,
      });
    }
  };

  // useEffect(() => {
  //   console.log("onlineAvailableDoctor", onlineAvailableDoctor);
  // }, [onlineAvailableDoctor]);

  // const getDoctorAndHospital = async (hospitalId, doctorId) => {
  //   setLoading(true);
  //   const hospRes = await hospitalsApi.getSingleHospital(hospitalId);

  //   if (!hospRes.ok) {
  //     setLoading(false);
  //     console.log(hospRes);
  //     return;
  //   }

  //   const docRes = await doctorsApi.getSingleDoctor(doctorId);
  //   if (!docRes.ok) {
  //     setLoading(false);
  //     console.log(docRes);
  //     return;
  //   }

  //   setDocDetail(docRes.data.doctor);
  //   setHospDetail(hospRes.data.hospital);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   if (hospitalId) {
  //     getDoctorAndHospital(hospitalId, doctorId);
  //   }
  // }, [hospitalId, doctorId]);

  return (
    <View style={styles.container}>
      <>
        <View style={styles.container1}>
          {active === "stepone" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose your vet
              </AppText>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  borderWidth: 1,
                  borderColor: "#B9C4CF",
                  borderRadius: 25,
                  marginBottom: 100,
                  width: "100%",
                }}
              >
                <Formik
                  initialValues={{
                    vet: "",
                  }}
                >
                  <>
                    <ChooseVetPicker
                      items={""}
                      label="Choose your vet"
                      name="Vet"
                      placeholder="Choose your vet"
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
                    <View style={{ marginHorizontal: 10, marginBottom: 0 }}>
                      {doctor.map((c, i) => (
                        <>
<<<<<<< HEAD
                          <View
                            key={`${c?.user?.name}-${i}`}
                            style={styles.catItem}
                          >
                            <Image
                              source={{ uri: c?.user?.profile_image }}
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
=======
                          <View key={`${c.name}-${i}`} style={styles.catItemm}>
>>>>>>> 0e1e10e27a5aac0c17f5d76ef97a6b88000e078a
                            <View
                              style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 50,
                              }}
                            >
                              <Image
                                source={c?.user?.profile_image}
                                style={styles.image1}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                if (c?.user?.isOnline) {
                                  handleActive("stepthree");
                                } else {
                                  handleActive("steptwo");
                                }

                                setSelectedDoctor([...selectedDoctor, c]);
                              }}
                            >
                              <View style={{ flexDirection: "column" }}>
                                <Text style={styles.text5}>
                                  {c?.user?.name}
                                </Text>
                                <Text style={styles.text6}>
                                  {c?.hospital?.name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <View
                              style={{
                                flex: 1,
                                alignItems: "flex-end",
                                marginHorizontal: 10,
                              }}
                            >
                              <Text style={styles.text7}>₹{c.fee}</Text>
                            </View>
                          </View>
                          <View
                            style={{
                              borderWidth: 0.75,
                              borderColor: "#EDEDED",
                              marginVertical: 0,
                            }}
                          />
                        </>
                      ))}
                    </View>
                  </>
                </Formik>
              </ScrollView>
            </>
          )}
          {active === "steptwo" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose your vet
              </AppText>
              <View style={{ marginTop: 30 }}>
                {selectedDoctor.map((c, i) => (
                  <>
                    <View key={`${c?.user?.name}-${i}`} style={styles.catItem1}>
                      <Image
                        source={{ uri: c?.user?.profile_image }}
                        size={15}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 30,
                          borderWidth: 2.5,
                          borderColor: "#FFFFFF",
                          margin: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            handleActive("stepone");
                          }}
                        >
                          <Text style={styles.text1}>{c?.user?.name}</Text>
                          <Text style={styles.text2}>{c?.hospital?.name}</Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          alignItems: "flex-end",
                          marginHorizontal: 10,
                        }}
                      >
                        <Text style={styles.text7}>₹{c.fee}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        alignItems: "center",
                        marginVertical: 20,
                      }}
                    >
                      <Text>
                        <Text
                          style={{
                            color: "#47687F",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Seems like your vet is
                        </Text>{" "}
                        <Text
                          style={{
                            color: "red",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          offline
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#47687F",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          now
                        </Text>
                      </Text>
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          borderWidth: 0.5,
                          borderColor: "#B9C4CF",
                          alignSelf: "center",
                          marginVertical: 15,
                        }}
                      />
                      <TouchableOpacity>
                        <Text
                          style={{
                            color: "#839BAB",
                            fontSize: 12,
                            fontWeight: "400",
                            margin: 10,
                          }}
                        >
                          How can we help you?
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          handleActive("stepfive");
                          getDocFromSameHospitals(
                            c?.hospital?._id,
                            c?.user?._id
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: "#37CF86",
                            fontSize: 12,
                            fontWeight: "400",
                            margin: 10,
                          }}
                        >
                          Choose any other vet from the same hospital
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          handleActive("stepfour");
                        }}
                      >
                        <Text
                          style={{
                            color: "#37CF86",
                            fontSize: 12,
                            fontWeight: "400",
                            margin: 10,
                          }}
                        >
                          Search for first available vet for Rs.100
                        </Text>
                      </TouchableOpacity>

                      <AppButton
                        title="Next"
                        onPress={() => handleActive("stepthree")}
                      />
                      <Text
                        style={{
                          color: "#839BAB",
                          fontSize: 9,
                          fontWeight: "700",
                          margin: 10,
                          textAlign: "center",
                        }}
                      >
                        (Video calls applies consultation fees along with
                        discounts for mandated visits)
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          onClosePress("close");
                          createRoomForChat(selectedDoctor[0], pets[0]);
                        }}
                      >
                        <Text>
                          <Text
                            style={{
                              color: "#839BAB",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Or is it just a short enquiry?
                          </Text>{" "}
                          <Text
                            style={{
                              color: "#37CF86",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Chat Now.
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ))}
              </View>
            </>
          )}
          {active === "stepthree" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose a service
              </AppText>
              <View style={{ marginTop: 30 }}>
                {selectedDoctor.map((c, i) => (
                  <>
                    <View key={`${c?.user?.name}-${i}`} style={styles.catItem1}>
                      <Image
                        source={{ uri: c?.user?.profile_image }}
                        size={15}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 30,
                          borderWidth: 2.5,
                          borderColor: "#FFFFFF",
                          margin: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleActive("stepone")}
                        >
                          <Text style={styles.text1}>{c?.user?.name}</Text>
                          <Text style={styles.text2}>{c?.hospital?.name}</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: "flex-end",
                          marginHorizontal: 10,
                        }}
                      >
                        <Text style={styles.text7}>₹{c.fee}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        alignItems: "center",
                        marginVertical: 20,
                      }}
                    >
                      <Text>
                        <Text
                          style={{
                            color: "#47687F",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Your vet is
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#41CE8A",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          online
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#47687F",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          now
                        </Text>
                      </Text>
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          borderWidth: 0.5,
                          borderColor: "#B9C4CF",
                          alignSelf: "center",
                          marginVertical: 15,
                        }}
                      />

                      <AppButton
                        title="Next"
                        onPress={() => {
                          onClosePress("close");
                          navigation.navigate("CallVet", {
                            doc: c,
                            pet: pets,
                          });
                        }}
                      />
                      <Text
                        style={{
                          color: "#839BAB",
                          fontSize: 9,
                          fontWeight: "700",
                          margin: 10,
                          textAlign: "center",
                        }}
                      >
                        (Video calls applies consultation fees along with
                        discounts for mandated visits)
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          createRoomForChat(selectedDoctor[0], pets[0]);
                        }}
                      >
                        <Text>
                          <Text
                            style={{
                              color: "#839BAB",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Or is it just a short enquiry?
                          </Text>{" "}
                          <Text
                            style={{
                              color: "#37CF86",
                              fontSize: 12,
                              fontWeight: "400",
                            }}
                          >
                            Chat Now.
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ))}
              </View>
            </>
          )}
          {active === "stepfour" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose a service
              </AppText>
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "400",
                  marginBottom: 20,
                }}
              >
                We found a first available vet
              </Text>
              <View style={{ margin: 10 }}>
                <>
                  <View
                    key={onlineAvailableVetDoctor._id}
                    style={styles.catItem2}
                  >
                    <Image
                      source={{
                        uri: onlineAvailableVetDoctor?.user?.profile_image,
                      }}
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
                      <TouchableOpacity onPress={() => handleActive("stepone")}>
                        <Text style={styles.text1}>
                          {onlineAvailableVetDoctor?.user?.name}
                        </Text>
                        <Text style={styles.text2}>
                          {onlineAvailableVetDoctor?.hospital?.name}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.Rectangle}>
                      <Text style={styles.text3}>100</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      alignItems: "center",
                      marginVertical: 20,
                    }}
                  >
                    <AppButton
                      title="Next"
                      onPress={() => {
                        onClosePress("close");
                        navigation.navigate("CallVet", {
                          doc: onlineAvailableVetDoctor,
                          pet: pets,
                          vetFee: 100,
                        });
                      }}
                    />
                    <Text
                      style={{
                        color: "#839BAB",
                        fontSize: 9,
                        fontWeight: "700",
                        margin: 10,
                        textAlign: "center",
                      }}
                    >
                      (Video calls applies consultation fees)
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        createRoomForChat(onlineAvailableVetDoctor, pets[0]);
                      }}
                    >
                      <Text>
                        <Text
                          style={{
                            color: "#839BAB",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Or is it just a short enquiry?
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#37CF86",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Chat Now.
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              </View>
            </>
          )}
          {active === "stepfive" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose a service
              </AppText>
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "400",
                  marginBottom: 20,
                }}
              >
                We found a vet from the same hospital
              </Text>
              <View style={{ margin: 10 }}>
                <>
                  <View style={styles.catItem2}>
                    <Image
                      source={{
                        uri: docDetailFromSameHospitals?.user?.profile_image,
                      }}
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
                      <TouchableOpacity onPress={() => handleActive("stepone")}>
                        <Text style={styles.text1}>
                          {docDetailFromSameHospitals?.user?.name}
                        </Text>
                        <Text style={styles.text2}>
                          {docDetailFromSameHospitals?.hospital?.name}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.Rectangle}>
                      <Text style={styles.text3}>
                        {docDetailFromSameHospitals.fee}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      alignItems: "center",
                      marginVertical: 20,
                    }}
                  >
                    <AppButton
                      title="Next"
                      onPress={() => {
                        onClosePress("close");
                        navigation.navigate("CallVet", {
                          doc: docDetailFromSameHospitals,
                          pet: pets,
                        });
                      }}
                    />
                    <Text
                      style={{
                        color: "#839BAB",
                        fontSize: 9,
                        fontWeight: "700",
                        margin: 10,
                        textAlign: "center",
                      }}
                    >
                      (Video calls applies consultation fees along with
                      discounts for mandated visits)
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        createRoomForChat(docDetailFromSameHospitals, pets[0]);
                      }}
                    >
                      <Text>
                        <Text
                          style={{
                            color: "#839BAB",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Or is it just a short enquiry?
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#37CF86",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Chat Now.
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              </View>
            </>
          )}
          {active === "stepsix" && (
            <>
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  margin: 20,
                  color: "#47687F",
                }}
              >
                Choose a service
              </AppText>
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "400",
                  marginBottom: 20,
                }}
              >
                Searching vet from same hospital
              </Text>
              <View style={{ margin: 10 }}>
                <>
                  <View
                    style={{
                      alignItems: "center",
                      marginVertical: 20,
                    }}
                  >
                    <Image
                      style={{
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                      source={require("../components/assets/images/loader.png")}
                    />
                    <AppButton
                      title="Next"
                      onPress={() => handleActive("stepone")}
                    />
                    <Text
                      style={{
                        color: "#839BAB",
                        fontSize: 9,
                        fontWeight: "700",
                        margin: 10,
                        textAlign: "center",
                      }}
                    >
                      (Video calls applies consultation fees along with
                      discounts for mandated visits)
                    </Text>

                    <TouchableOpacity>
                      <Text>
                        <Text
                          style={{
                            color: "#839BAB",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Or is it just a short enquiry?
                        </Text>{" "}
                        <Text
                          style={{
                            color: "#37CF86",
                            fontSize: 12,
                            fontWeight: "400",
                          }}
                        >
                          Chat Now.
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              </View>
            </>
          )}
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
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
  catItem1: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
    borderWidth: 1,
    borderColor: "#B9C4CF",
    borderRadius: 30,
    height: 60,
  },
  catItem2: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
  catItemText: {
    color: "#47687F",
    fontWeight: "400",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    marginRight: 180,
  },
  // Rectangle: {
  //   width: 80,
  //   height: 30,
  //   backgroundColor: "#f3f3f3",
  //   borderRadius: 20,
  //   left: 10,
  //   justifyContent: "center",
  //   alignContent: "center",
  //   alignItems: "center",
  //   borderWidth: 1,
  //   borderColor: "#51DA98",
  // },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
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
    marginLeft: 60,
  },

  catItemm: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  image1: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    elevation: 10,
    backgroundColor: "#FFFFFF",
  },
  text5: {
    color: "#47687F",
    fontWeight: "700",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    fontSize: 12,
  },
  text6: {
    color: "#47687F",
    fontWeight: "400",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    fontSize: 12,
  },
  text7: {
    color: "#47687F",
    fontWeight: "700",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    fontSize: 20,
  },
});

export default ServiceScreen;
