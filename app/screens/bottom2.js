import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  StyleSheet,
} from 'react-native';

const Bottom2 = () => {
  return (
    <View style={styles.container}>
      <Text>Bottom2</Text>
    </View>
  );
};

export default Bottom2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
});
