import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ipAddress = '10.0.2.2';

const RegistrationScreen = ({ onRegistrationComplete }) => {
  const navigation = useNavigation();


  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');

  const handleRegistration = async () => {
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return;
        }
        //TODO: Backend Django api call to register the user

        const userData = {
          email: email,
          username: username,
          password: password,
          first_name: firstName,
          last_name: lastName,
        };

        try {
          const response = await fetch(`http://${ipAddress}:8000/register/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            // console.log(data)
            // onRegistrationComplete();
            
            Alert.alert('Success', 'User created successfully. Please log in.');
            navigation.navigate('SignIn');
            
          } else if (response.status === 400){
            Alert.alert('Error', data.error || 'An unknown error occurred');
          }  else {
            Alert.alert('Error', 'An error occurred when registering');
          }
        } catch (error) {
          Alert.alert('Error', 'Network error');
        }

        
      };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
        <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {/* TODO: add a Profile Name, currently its empty */}
      <Button title="Register" onPress={handleRegistration} />
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

export default RegistrationScreen;
