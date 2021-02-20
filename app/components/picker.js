import React, { Component, useState } from "react";
import { Platform, StyleSheet, View, Button,  Alert, Text } from "react-native";
import {Picker} from '@react-native-picker/picker';
import Select from 'react-select';

class Pick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosenIndex: 0
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text1}>3. Appetite </Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="1"/>
          <Picker.Item label="b. Not Observed" value="2"/>
          <Picker.Item label="c. Different from Normal" value="3"/>
        </Picker>

        <Text style={styles.text1}>4. General Behaviour</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="4"/>
          <Picker.Item label="b. Not Observed" value="5"/>
          <Picker.Item label="c. Different from Normal" value="6"/>
        </Picker>

        <Text style={styles.text1}>5. Activity</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="7"/>
          <Picker.Item label="b. Not Observed" value="8"/>
          <Picker.Item label="c. Different from Normal" value="9"/>
        </Picker>

        <Text style={styles.text1}>6. Feces (Select all options that apply)</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="10"/>
          <Picker.Item label="b. Not Observed" value="11"/>
          <Picker.Item label="c. Abnormal Colour" value="12"/>
          <Picker.Item label="d. Worms" value="13"/>
        </Picker>

        <Text style={styles.text1}>7. Urine (Select all options that apply)</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="14"/>
          <Picker.Item label="b. Not Observed" value="15"/>
          <Picker.Item label="c. Abnormal Colour" value="16"/>
        </Picker>

        <Text style={styles.text1}>8. Eyes</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="17"/>
          <Picker.Item label="b. Abnormal Discharge" value="18"/>
          <Picker.Item label="c. Kotlin" value="19"/>
        </Picker>

        <Text style={styles.text1}>9. Mucous Membrane of the Eye</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. White" value="20"/>
          <Picker.Item label="b. Pink-White" value="21"/>
          <Picker.Item label="c. Pink" value="22"/>
          <Picker.Item label="d. Red-Pink" value="23"/>
          <Picker.Item label="e. Red" value="24"/>
          <Picker.Item label="f. Dark Red" value="25"/>
          <Picker.Item label="g. Yellow" value="26"/>
        </Picker>

        <Text style={styles.text1}>10. Ears (Select all options that apply)</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="27"/>
          <Picker.Item label="b. Abnormal Discharge" value="28"/>
          <Picker.Item label="c. Abnormal Odour" value="29"/>
          <Picker.Item label="d. Abnormal appearance" value="30"/>
        </Picker>


        <Text style={styles.text1}>11. Skin and Coat (Select all options that apply)</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="31"/>
          <Picker.Item label="b. Injuries" value="32"/>
          <Picker.Item label="c. Odour" value="33"/>
          <Picker.Item label="d. Hairfall" value="34"/>
          <Picker.Item label="e. Rough Coat" value="35"/>
          <Picker.Item label="f. Changes in Appearance" value="36"/>
        </Picker>

        <Text style={styles.text1}>12. Gait</Text>
        <Picker
        style={styles.pickerstyles}
        selectedValue = {this.state.language}
        onValueChange={(
          itemValue, itemPosition
        ) => this.setState({
          language: itemValue, choosenIndex: itemPosition
        })}
        >
          <Picker.Item label="a. Normal" value="37"/>
          <Picker.Item label="b. Not Observed" value="38"/>
          <Picker.Item label="c. Different from Normal" value="39"/>
        </Picker>

      </View>
    );
  }
}

export default Pick;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    // alignItems: "center", 
    justifyContent: "center"
  }, 
  text1: {
    margin: 10, 
    fontSize: 20, 
    // textAlign: "center"
  }, 
  pickerstyles: {
    height: 100, 
    width: "100%", 
    color: "#000", 
    justifyContent: "center"
  }

})


