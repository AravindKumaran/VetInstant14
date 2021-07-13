import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import petsApi from "../api/pets";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import ErrorMessage from "../components/forms/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";

import AppFormPicker from "../components/forms/AppFormPicker";
import AppImagePicker from "../components/forms/AppImagePicker";
import AppImageListPicker from "../components/forms/AppImageListPicker";
import AppText from "../components/AppText";

import ChoosePicker from "../components/forms/ChoosePicker";
import DateTimePicker from "@react-native-community/datetimepicker";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  breed: Yup.string().required().label("Breed"),
  // years: Yup.number().required("*Required").min(0),
  // months: Yup.number()
  //   .test("samefield", "*Required", function (value) {
  //     if (value < 0 || value > 11) return false;
  //     return true;
  //   })
  //   .required("*Required")
  //   .min(0),
  // weight: Yup.number().required().min(1).label("Weight"),
  gender: Yup.string().nullable("Please pick pet gender"),
  type: Yup.string().required("Please pick a species").nullable(),
  photo: Yup.string().required("Please select your pet image").nullable(),
  // images: Yup.array().label("Images"),
  description: Yup.string().required().label("description"),
  date: Yup.date().nullable().label("dob"),
});

const petTypes = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Cattle", value: "cattle" },
  { label: "Sheep/Goat", value: "sheep/goat" },
  { label: "Poultry", value: "poultry" },
];

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const AddPetScreen = ({ navigation, route }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // console.log('AddRoutes', route?.params?.pet?.photo)

  const [date, setDate] = useState((route?.params?.editPet) ? new Date(route?.params?.pet?.dob):new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

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

  const editValues = {
    name: route?.params?.pet?.name,
    breed: route?.params?.pet?.breed,
    // years: String(route?.params?.pet?.years),
    // months: String(route?.params?.pet?.months),
    // weight: String(route?.params?.pet?.weight),
    photo: `${route?.params?.pet?.photo}`,
    gender: route?.params?.pet?.gender,
    type: route?.params?.pet?.type,
    // images: route?.params?.pet?.petHistoryImages,
    description: route?.params?.pet?.description,
    date: new Date(route?.params?.pet?.dob)
  };

  useEffect(() => {
    if (route?.params?.editPet) {
      navigation.setOptions({ title: "Edit Pet" });
    }
  }, []);

  const handleSubmit = async (values) => {
    // console.log('Values', values)
    const form = new FormData();
    if (route?.params?.editPet) {
      if (!values.photo?.startsWith("https")) {
        form.append("photo", {
          name: "photo",
          type: "image/jpeg",
          uri: values.photo,
        });
      }
    }

    if (!route?.params?.editPet) {
      form.append("photo", {
        name: "photo",
        type: "image/jpeg",
        uri: values.photo,
      });
    }

    // if (values.images && !route?.params?.editPet) {
    //   values.images.forEach((image, index) => {
    //     form.append("images", {
    //       name: "image" + index,
    //       type: "image/jpeg",
    //       uri: image,
    //     });
    //   });
    // }
    form.append("name", values.name);
    // form.append("years", +values.years);
    // form.append("months", +values.months);
    form.append("breed", values.breed);
    form.append("gender", values.gender);
    form.append("type", values.type);
    // form.append("weight", +values.weight);
    form.append("description", values.description);
    form.append("dob", date.toISOString());
    setLoading(true);

    let res;
    if (route?.params?.editPet) {
      res = await petsApi.updatePet(route?.params?.pet?._id, form);
    } else {
      res = await petsApi.savePet(form);
    }
    if (!res.ok) {
      setLoading(false);
      setError(res?.data?.msg);
      console.log(res);
      return;
    }

    setError(null);
    navigation.navigate("Home", { pet: values });
    setLoading(false);
  };
  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {error && <ErrorMessage error={error} visible={!loading} />}

          <Formik
            initialValues={
              route?.params?.editPet
                ? editValues
                : {
                    name: "",
                    breed: "",
                    // years: "",
                    // months: "",
                    // weight: "",
                    photo: null,
                    gender: null,
                    type: null,
                    // images: [],
                    description: "",
                    date: date,
                  }
            }
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ setFieldValue }) => {
              // useEffect(() => {
              //   if (route?.params?.editPet) {
              //     setFieldValue('name', route?.params?.pet?.name, true)
              //   }
              // }, [])
              return (
                <>
                  <View style={{ margin: 20 }}>
                    <View
                      style={{
                        alignSelf: "center",
                        marginBottom: 10,
                      }}
                    >
                      <AppImagePicker name="photo" />
                    </View>

                    <View
                      style={{
                        paddingBottom: 20,
                        width: "110%",
                        alignSelf: "center",
                      }}
                    >
                      <AppText style={{ paddingLeft: 15 }}>
                        Choose pet's type
                      </AppText>
                      <ChoosePicker
                        items={petTypes}
                        name="type"
                        placeholder="Choose pet's type"
                      />
                    </View>

                    <AppFormField
                      label="Pet Name"
                      autoCapitalize="none"
                      autoCorrect={false}
                      name="name"
                      // placeholder="Enter your pet name"
                    />
                    <AppFormField
                      label="Tell Us About Your Pet"
                      autoCapitalize="none"
                      autoCorrect={false}
                      name="description"
                      // placeholder="Enter your pet breed"
                    />
                    <AppFormField
                      label="Breed"
                      autoCapitalize="none"
                      autoCorrect={false}
                      name="breed"
                      // placeholder="Enter your pet breed"
                    />

                    <View style={styles.wrapper1}>
                      <View
                        style={{
                          height: 60,
                          borderWidth: 1,
                          borderColor: "rgba(21, 56, 95, 0.3)",
                          borderRadius: 60,
                          justifyContent: "center",
                          top: 5,
                          width: "45%",
                        }}
                      >
                        <AppText
                          style={{
                            left: 30,
                            top: -15,
                            fontSize: 14,
                            position: "absolute",
                            color: "#25C578",
                            fontWeight: "700",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          D.O.B
                        </AppText>
                        <TouchableOpacity
                          onPress={showDatepicker}
                          style={{
                            alignContent: "center",
                            paddingLeft: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "#47687F",
                              fontWeight: "400",
                              fontSize: 18,
                            }}
                          >
                            {date.toLocaleDateString()}
                          </Text>
                        </TouchableOpacity>
                        {show && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                          />
                        )}
                      </View>
                      <View style={{ width: "50%" }}>
                        <ChoosePicker
                          items={genders}
                          name="gender"
                          label="Gender"
                          placeholder="Choose gender"
                        />
                      </View>
                    </View>

                    {/* <AppFormField
                      label="Weight(kgs)"
                      autoCapitalize="none"
                      autoCorrect={false}
                      name="weight"
                      keyboardType="numeric"
                      // placeholder="Enter your pet weight in kgs"
                      maxLength={5}
                    /> */}
                  </View>

                  {/* {!route?.params?.editPet && (
                    <>
                      <View
                        style={{
                          alignSelf: "center",
                          alignItems: "center",
                          height: 230,
                        }}
                      >
                        <AppText style={{ marginVertical: 20 }}>
                          Pet History (Optional)
                        </AppText>
                        <AppImageListPicker name="images" />
                      </View>
                    </>
                  )} */}

                  <View style={{ height: 170 }}>
                    <SubmitButton
                      title={
                        route?.params?.editPet ? "Save Changes" : "Save Pet"
                      }
                    />
                  </View>
                </>
              );
            }}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  wrapper: {
    flexDirection: "row",
    width: "50%",
  },
  wrapper1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

export default AddPetScreen;
