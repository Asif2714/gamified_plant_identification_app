import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { UserContext } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ipAddress = "10.0.2.2";

export default function ProfileScreen(props) {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDetails = async () => {
    const username = await AsyncStorage.getItem("username");
    console.log(`fetching user details with username: ${username}`)
    try {
      const response = await fetch(`http://${ipAddress}:8000/user-details/?username=${username}`, {
        method: "GET",
        headers: {
          // Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setUser(data);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch user details:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
}, []);

if (isLoading) {
  return <Text>Loading...</Text>;
}

  return (
    <View style={styles.container}>
            <Text style={styles.text}>Username: {user.username}</Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Profile Name: {user.profile_name}</Text>
            {user.profile_picture && <Image source={{ uri: user.profile_picture }} style={styles.image} />}
            <Text style={styles.text}>Experience Points: {user.experience_points}</Text>


            <Button title="Log Out" onPress={props.onSignOut} />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  text: {
      fontSize: 16,
      marginBottom: 10,
  },
  image: {
      width: 100,
      height: 100,
      marginBottom: 10,
  },
});