import React from "react";
import { useFormikContext } from "formik";
import CheckboxList from "rn-checkbox-list";
import ErrorMessage from "./ErrorMessage";

const CheckList = ({ label, items, name, placeholder }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <CheckboxList
        listItems={items}
        //onChange={(selectedListItems) => setFieldValue(name, selectedListItems)}
        onPress={() => this.selectCurrentItem(items)}
        selectedListItems={values[name]}
        theme="#41CE8A"
        listItemStyle={{
          color: "#47687F",
          margin: -5,
        }}
      />
      <ErrorMessage error={errors[name]} visible={values[name]} />
    </>
  );
};

export default CheckList;
