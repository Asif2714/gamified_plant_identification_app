import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { UserContext } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Modal } from "react-native";
import MapView, { Marker } from "react-native-maps";

// Importing components
// import ProfilePlantCarousel from "../components/ProfilePlantCarousel";
import Slider from "../components/Slider";
import CONFIG from "../app_config";
import FeedbackModal from '../modals/FeedbackModal';

export default function ProfileScreen(props) {
  const { user, setUser, setUserToken, setUserId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  // Icons to be used for the profile card section
  const iconsize = 20;
  const ProfileIcon = <Icon name="person" size={iconsize} color="#252900" />;
  const EmailIcon = <Icon name="mail" size={iconsize} color="#252900" />;
  const XPIcon = <Icon name="trophy" size={iconsize} color="gold" />;
  const StreakIcon = <Icon name="flame" size={iconsize} color="red" />;

  // Storing list and details of plants for user
  const [userPlantDetails, setUserPlantDetails] = useState([]);

  // methods to swithc feedback modal visibility
  const showFeedbackModal = () => {
    setFeedbackModalVisible(true);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalVisible(false);
  };

  const handleFeedbackSubmission = () => {
    closeFeedbackModal();
    Alert.alert("Thank you!", "Your feedback has been submitted");
  };

  const fetchUserDetails = async () => {
    const username = await AsyncStorage.getItem("username");
    console.log(`fetching user details with username: ${username}`);
    try {
      request = `${CONFIG.API_URL}/user-details/?username=${username}`;
      const response = await fetch(request, {
        method: "GET",
        headers: {
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
      const response = await fetch(`${CONFIG.API_URL}/logout/`, {
        method: "POST",
        headers: {
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

  const handleFeedbackPress = () => {
    Alert.alert("To be implemented soon!");
  };

  const fetchUserPlants = async () => {
    console.log("Fetching user plants");
    const username = await AsyncStorage.getItem("username");

    try {
      const response = await fetch(
        `${CONFIG.API_URL}/get-user-plants-with-details/${username}/`
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

  const toggleMap = () => {
    setIsMapVisible(!isMapVisible);
  };

  const getMarkerColor = (rarity) => {
    console.log("Rarity: ", rarity);
    switch (rarity) {
      case "CR":
        return "#EA5448";
      case "EN":
        return "#DA891C";
      case "VU":
        return "#FFC476";
      case "NT":
        return "#1A5B8C";
      case "LC":
        return "#5586AC";
      case "Not Listed":
        return "#7F7F7F";
      default:
        return "blue";
    }
  };

  const CustomMarker = ({ color }) => (
    <View style={[styles.marker, { backgroundColor: color }]}></View>
  );

  const renderMapMarkers = () => {
    return userPlantDetails.map((plant, index) => {
      const [latitude, longitude] = plant.fields.gps_coordinates.split(",");
      console.log(latitude, longitude);
      const markerColor = getMarkerColor(plant.fields.rarity);
      const imageUri = `${CONFIG.API_URL}${plant.fields.image}`; //TODO: add image to marker
      return (
        <Marker
          key={index}
          coordinate={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }}
          title={plant.fields.common_name}
          description={plant.fields.scientific_name}
        >
          {/* Using CustomMarker instead of pinColor, pincolor doesn't work and pin stays red */}
          <CustomMarker color={markerColor} />
        </Marker>
      );
    });
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
            <View style={styles.infoBox}>
              {ProfileIcon}
              <Text style={styles.infoText}>
                Name: {user.profile_name || "Not set"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              {EmailIcon}
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoBox}>
              {XPIcon}
              <Text style={styles.infoText}>{user.experience_points} XP</Text>
            </View>
            <View style={styles.infoBox}>
              {StreakIcon}
              <Text style={styles.infoText}>
                Streak: {user.current_streak || 0} Days
              </Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Image
              source={{
                uri:
                  `${CONFIG.API_URL}${user.profile_picture}` ||
                  "default_image_placeholder_TODO",
              }}
              style={styles.profileImage}
              onError={(e) => console.log(e.nativeEvent.error)}
            />
            <Text style={[styles.text, styles.username]}>{user.username}</Text>
          </View>
        </View>
      </View>

      <Text>Plant you have identified:</Text>
      <Slider userPlantDetails={userPlantDetails} />

      <View style={styles.buttonContainer}>
        {/* Buttons at the bottom of the window */}
        <TouchableOpacity style={styles.button} onPress={toggleMap}>
          <Text style={styles.buttonText}>See Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={showFeedbackModal}>
            <Text style={styles.buttonText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

        {/* Modals */}
        {/* Map modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={isMapVisible}
          onRequestClose={toggleMap}
        >
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              // Setting default plant loc
              initialRegion={{
                latitude:
                  userPlantDetails.length > 0
                    ? parseFloat(
                        userPlantDetails[0].fields.gps_coordinates.split(",")[0]
                      )
                    : 37.78825,
                longitude:
                  userPlantDetails.length > 0
                    ? parseFloat(
                        userPlantDetails[0].fields.gps_coordinates.split(",")[1]
                      )
                    : -122.4324,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004,
              }}
            >
              {renderMapMarkers()}
            </MapView>
            <TouchableOpacity style={styles.closeMap} onPress={toggleMap}>
              <Text style={styles.closeMapText}>Close Map</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Feedback modal */}
        <FeedbackModal
        isVisible={feedbackModalVisible}
        onClose={closeFeedbackModal}
        onSubmitFeedback={handleFeedbackSubmission}
      />
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
    backgroundColor: "#F6FBF4",
    borderRadius: 10,
    padding: 2,
    marginBottom: 5,
    elevation: 3,
    color: "#252900",
    flexDirection: 'column'
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#F6FBF4",
    borderRadius: 10,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#252900", 
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
    width: 60,
    height: 60,
    borderRadius: 7,
    backgroundColor: "#ccc",
  },
  username: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    padding: 12,
  },
  button: {
    backgroundColor: "#252900",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#F6FBF4",
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeMap: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#F6FBF4",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#195100",
    elevation: 3, //shadow
  },
  closeMapText: {
    color: "#252900",
    fontWeight: "bold",
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
});

// #195100 main

// #252900 sec

// #F6FBF4 background
