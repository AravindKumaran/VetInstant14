import React from "react";
import { useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

import ErrorMessage from "./ErrorMessage";
import AppText from "../AppText";

import { StyleSheet } from "react-native";

const ChooseVetPicker = ({ label, items, name, placeholder }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <RNPickerSelect
        useNativeAndroidPickerStyle={false}
        onValueChange={(value) => setFieldValue(name, value)}
        style={pickerSelectStyles}
        items={items}
        value={values[name]}
        placeholder={placeholder}
        placeholderTextColor="red"
        Icon={() => (
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#47687F"
          />
        )}
      />

      <ErrorMessage error={errors[name]} visible={!values[name]} />
    </>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    padding: 15,
    marginVertical: 10,
    color: "#47687F",
    flex: 1,
    overflow: "scroll",
    // paddingRight: 30,
    width: "82.5%",
    borderBottomWidth: 1,
    borderColor: "#47687F",
    marginRight: 30,
    marginLeft: 30,
  },
  inputAndroid: {
    fontSize: 14,
    padding: 15,
    marginVertical: 10,
    color: "#47687F",
    flex: 1,
    overflow: "scroll",
    // paddingRight: 30,
    width: "82.5%",
    borderBottomWidth: 1,
    borderColor: "#47687F",
    marginRight: 30,
    marginLeft: 30,
  },
  iconContainer: {
    top: 30,
    right: 40,
  },
});
export default ChooseVetPicker;
