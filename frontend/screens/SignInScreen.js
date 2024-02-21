import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ipAddress = '10.0.2.2';

const SignInScreen = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = async () => {

    // onSignIn('TODO User token'); 

    try {
      const response = await fetch(`http://${ipAddress}:8000/login/`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('username', username);
        onSignIn(data.token);
      } else {
        Alert.alert('Error', data.error || 'Error occured when signing in.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error when making request to backend');
    }



  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {/* TODO: implmeent sign in proper func after finishing registration, currently it's dummy sign */}
      {/* <Button title="Sign In" onPress={handleSignIn} /> */}
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default SignInScreen;
