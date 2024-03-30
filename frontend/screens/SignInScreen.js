import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../app_config';

const SignInScreen = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = async () => {

    // onSignIn('TODO User token'); 
    console.log(`${CONFIG.API_URL}/login/`)

    try {
        

      const response = await fetch(`${CONFIG.API_URL}/login/`, {
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
