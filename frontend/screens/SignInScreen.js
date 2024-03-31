import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text} from 'react-native';
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
       <Text style={styles.appName}>Plant Explorer</Text>
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
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: "#F6FBF4",
    },
    appName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: "#252900",
      marginBottom: 40,
      alignSelf: 'center',
    },
    input: {
      height: 50,
      borderRadius: 9,
      padding: 15,
      backgroundColor: "#ffffff",
      borderColor: "#195100",
      borderWidth: 1,
      marginBottom: 15,
    },
    signInButton: {
      height: 50,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#195100",
      marginTop: 20,
    },
    signInButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default SignInScreen;
