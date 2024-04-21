import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import CONFIG from "../app_config";

const RegistrationScreen = ({ onRegistrationComplete }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    // regex from https://stackoverflow.com/questions/4964691/super-simple-email-validation-with-javascript
    let emailRegex = /^\S+@\S+\.\S+$/;

    let isValid = true;
    let errors = {};

    if (!email) {
      errors.email = "Email missing";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "invalid email";
      isValid = false;
      Alert.alert("Invalid email", "Enter a valid email address", [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ]);
    }

    if (!username) {
      errors.username = "Username missing";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password missing";
      isValid = false;
    }
    if (!confirmPassword) {
      errors.password = "Confirm Password missing";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleRegistration = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Validation fo rempty fields:
    if (!validate()) {
      return;
    }

    const userData = {
      email: email,
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
    };

    try {
      const response = await fetch(`${CONFIG.API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // console.log(data)
        // onRegistrationComplete();

        Alert.alert("Success", "User created successfully. Please log in.");
        navigation.navigate("SignIn");
      } else if (response.status === 400) {
        Alert.alert("Error", data.error || "An unknown error occurred");
      } else {
        Alert.alert("Error", "An error occurred when registering");
      }
    } catch (error) {
      Alert.alert("Error", "Network error");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email*</Text>
          <TextInput
            style={[
              styles.input,
              errors.email && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username*</Text>
          <TextInput
            style={[
              styles.input,
              errors.username && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter first name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password*</Text>
          <TextInput
            style={[
              styles.input,
              errors.password && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password*</Text>
          <TextInput
            style={[
              styles.input,
              errors.confirmPassword && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="Confirm your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegistration}
      >
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F6FBF4",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    height: 50,
    borderRadius: 9,
    padding: 15,
    backgroundColor: "white",
    borderColor: "#195100",
    borderWidth: 1,
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: "#252900",
    marginBottom: 5,
  },
  errorInput: {
    borderColor: "red",
  },

  registerButton: {
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#195100",
    marginTop: 20,
    width: 200,
    alignSelf: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegistrationScreen;
