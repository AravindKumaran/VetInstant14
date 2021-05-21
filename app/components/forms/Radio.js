import React from "react";
import { useFormikContext } from "formik";
import RadioForm from "react-native-simple-radio-button";
import ErrorMessage from "./ErrorMessage";

const RadioButtons = ({ label, items, name, placeholder }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <RadioForm
        onPress={(value) => setFieldValue(name, value)}
        radio_props={items}
        testID={values[name]}
        initial={null}
        formHorizontal={false}
        labelHorizontal={true}
        labelColor={"#47687F"}
        animation={true}
        buttonColor={"#B9C4CF"}
        selectedButtonColor={"#60E6A6"}
      />
      <ErrorMessage error={errors[name]} visible={!values[name]} />
    </>
  );
};

export default RadioButtons;
