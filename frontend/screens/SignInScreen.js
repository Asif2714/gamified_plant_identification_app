import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet} from 'react-native';


const SignInScreen = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = () => {
    onSignIn('TODO User token'); 
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
      <Button
        title="Sign In"
        onPress={() => onSignIn("SignedIn!")}
      />
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
