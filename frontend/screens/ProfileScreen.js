import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ProfileScreen (props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <Button title="Log Out" onPress={props.onSignOut} />
      {/* <Button title="Log Out" onPress={() => this.props.onSignOut} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
