import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import petsApi from "../api/pets";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import ErrorMessage from "../components/forms/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";

import FormImagePicker from "../components/forms/FormImagePicker";
import AppFormPicker from "../components/forms/AppFormPicker";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  breed: Yup.string().required().label("Breed"),
  age: Yup.number().required().min(0).label("Age"),
  weight: Yup.number().required().min(1).label("Weight"),
  gender: Yup.string().required("Please pick pet gender").nullable(),
  type: Yup.string().required("Please pick pet type").nullable(),
  photo: Yup.string().required("Please select your pet image").nullable(),
});

const petTypes = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Other...", value: "other" },
];

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const AddPetScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const form = new FormData();
    form.append("photo", {
      name: "photo",
      type: "image/jpeg",
      uri: values.photo,
    });
    form.append("name", values.name);
    form.append("age", values.age);
    form.append("breed", values.breed);
    form.append("gender", values.gender);
    form.append("notes", values.notes);
    form.append("type", values.type);
    form.append("weight", values.weight);
    setLoading(true);
    const res = await petsApi.savePet(form);
    if (!res.ok) {
      setLoading(false);
      // setError(res.data.msg);
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
      <ScrollView vertical={true}>
        <View style={styles.container}>
          {error && <ErrorMessage error={error} visible={!loading} />}

          <Formik
            initialValues={{
              name: "",
              breed: "",
              age: "",
              weight: "",
              notes: "",
              photo: null,
              gender: null,
              type: null,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <FormImagePicker name='photo' />
                <AppFormPicker items={petTypes} label='Type' name='type' />

                <AppFormField
                  label='Name'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='name'
                  placeholder='enter your pet name'
                />
                <AppFormField
                  label='Breed'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='breed'
                  placeholder='enter your pet breed'
                />
                <AppFormPicker items={genders} label='Gender' name='gender' />

                <AppFormField
                  label='Age'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='age'
                  keyboardType='numeric'
                  placeholder='enter your pet age in yrs'
                />

                <AppFormField
                  label='Weight'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='weight'
                  keyboardType='numeric'
                  placeholder='enter your pet weight in lbs'
                />

                <AppFormField
                  label='Notes'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='notes'
                  numberOfLines={5}
                />

                <SubmitButton title='Save Pet' />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 20,
  },
});

export default AddPetScreen;
