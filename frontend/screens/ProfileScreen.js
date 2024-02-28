import React, { useState, useEffect, useContext, useCallback  } from "react";
import { View, Text, StyleSheet, Button, Image, FlatList } from "react-native";
import { UserContext } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';


// Importing components
import ProfilePlantCarousel from "../components/ProfilePlantCarousel";
import Slider from "../components/Slider"

const ipAddress = "10.0.2.2";

export default function ProfileScreen(props) {
  const { user, setUser, setUserToken, setUserId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  // Storing list and details of plants for user
  const [userPlantDetails, setUserPlantDetails] = useState([]);

  const fetchUserDetails = async () => {
    const username = await AsyncStorage.getItem("username");
    console.log(`fetching user details with username: ${username}`);
    try {
      request =  `http://${ipAddress}:8000/user-details/?username=${username}`
      const response = await fetch(
        request,
        {
          method: "GET",
          headers: {
            // Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
      console.error(`request: ${request}`)
    }
  };

  // loading data when component mounts in App
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleSignOut = async () => {
    const userToken = await AsyncStorage.getItem("userToken");

    try {
      const response = await fetch(`http://${ipAddress}:8000/logout/`, {
        method: "POST",
        headers: {
          // Authorization: `Token ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Logged out successfully");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }

    // Clearing context API
    setUser(null);
    setUserToken(null);
    setUserId(null);

    // Clear AsyncStorage
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("userId");

    props.onSignOut();
  };

  const fetchUserPlants = async () => {
    console.log("Fetching user plants")
    const username = await AsyncStorage.getItem("username");

    try {
      const response = await fetch(
        `http://${ipAddress}:8000/get-user-plants-with-details/${username}/`
      );
      const json = await response.json();

      if (response.ok) {
        const plantDetails = JSON.parse(json.plants_data);
        setUserPlantDetails(plantDetails);
        // console.log("Plant details set:", plantDetails);
      } else {
        console.error("Failed to fetch plant names");
      }
    } catch (error) {
      console.error("Error fetching plant names:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPlants();
    }
  }, [user]);

  const renderPlantName = ({ item }) => {
    return <Text style={styles.plantName}>{item}</Text>;
  };


  // fetch userplants everytime the page is loaded
  useFocusEffect(
    useCallback(() => {
      const fetchPlants = async () => {
        const username = await AsyncStorage.getItem('username');
        if (username) {
          fetchUserPlants();
        }
      };
  
      fetchPlants();
    }, [])
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  //TODO: minor glitch when it still stays like this for a brief moment, need to fix, or
  else if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available.</Text>
        <Button title="Log Out" onPress={handleSignOut} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username: {user.username}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Text style={styles.text}>Profile Name: {user.profile_name}</Text>
      <Image
        //TODO: shift to amazon s3, or update this url later to not have emulator ip.
        source={{ uri: `http://10.0.2.2:8000${user.profile_picture}` }}
        style={styles.image}
        onError={(e) => console.log(e.nativeEvent.error)} 
      />
      <Text style={styles.text}>
        Experience Points: {user.experience_points}
      </Text>

      <Text>Plant you have identified:</Text>
      {/* User's plant section */}
      {/* <FlatList
        data={plantNames}
        renderItem={renderPlantName}
        keyExtractor={(item, index) => index.toString()}
        style={styles.plantList}
      /> */}
      {/* TODO: react native reanimated carousel */}
      {/* <ProfilePlantCarousel userPlantDetails={userPlantDetails}>
        
      </ProfilePlantCarousel> */}
      <Text>Custom carousel placeholder</Text>

        <Slider userPlantDetails={userPlantDetails}/>


      <Button title="Log Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
