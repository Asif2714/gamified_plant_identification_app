import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

// Importing components
// import ProfilePlantCarousel from "../components/ProfilePlantCarousel";
import Slider from "../components/Slider";

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
      request = `http://${ipAddress}:8000/user-details/?username=${username}`;
      const response = await fetch(request, {
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
      console.error(`request: ${request}`);
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
    console.log("Fetching user plants");
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
    //   fetchUserDetails();
    }
  }, [user]);

  useEffect(() => {
    fetchUserDetails();
  }, []); 


  // fetch userplants everytime the page is loaded
  useFocusEffect(
    useCallback(() => {
      const fetchPlants = async () => {
        const username = await AsyncStorage.getItem("username");
        if (username) {
          fetchUserPlants();
        }
      };

      fetchPlants();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
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
      <View style={styles.userInfoSection}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Text style={styles.text}>
              Profile Name: {user.profile_name || "Not set"}
            </Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>
              Experience Points: {user.experience_points}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Image
              source={{
                uri:
                  `http://10.0.2.2:8000${user.profile_picture}` ||
                  "default_image_placeholder",
              }}
              style={styles.profileImage}
              onError={(e) => console.log(e.nativeEvent.error)}
            />
            <Text style={[styles.text, styles.username]}>
              {/* Username: {user.username} */}
              {user.username}
            </Text>
          </View>
        </View>
      </View>

      <Text>Plant you have identified:</Text>
      <Slider userPlantDetails={userPlantDetails} />

      <View style={styles.buttonContainer}>
      <Button title="See Map"></Button>
      <Button title="Settings"></Button>
      <Button title="Log Out" onPress={handleSignOut} />
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 16,
    // marginBottom: 10,
  },
  userInfoSection: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  leftSection: {
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 7,
    backgroundColor: "#ccc",
  },
  username: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    
  }
});
