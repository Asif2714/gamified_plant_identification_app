import React, { useState } from "react";
import { View, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import { Ionicons } from "@expo/vector-icons";
import CONFIG from "../app_config";

export default function TakeImageScreen() {
  const [imageIdentified, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);

  const processImage = async (image) => {
    const formdata = new FormData();

    formdata.append("file", {
      uri: image.uri,
      type: image.mimeType || "image/jpeg",
      name: image.fileName || "uploaded_image.jpg",
    });

    try {
      let response = await fetch(`${CONFIG.API_URL}/predict/`, {
        method: "POST",
        body: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let responseJson = await response.json();
      console.log(responseJson, "responseJson");
      setImageDetails(responseJson); // Save the details of img for later use

      const confidencePercentage = (responseJson.confidence * 100).toFixed(2);
      const formattedResponse = `Scientific Name: ${responseJson.scientific_name}\nCommon Name: ${responseJson.common_name}\nConfidence: ${confidencePercentage}%\nConservation Status (Rarity): ${responseJson.conservation_status}`;

      Alert.alert("Identification Results", formattedResponse, [
        {
          text: "OK",
          onPress: () => showSaveConfirmation(image, responseJson),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Server Connection Error",
        "Could not connect to the server."
      );
    }
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // 4:3 aspect ratio set to keep consistency, so all images
      // are the same, in home page, profile page, etc.
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]); // Save image for later use
      await processImage(result.assets[0]);
    }
  };

  const takeImageWithCamera = async () => {

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is required to take pictures in the app');
        return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      await processImage(result.assets[0]);
    }
  };

  const showSaveConfirmation = (image, details) => {
    Alert.alert("Save Picture", "Do you want to save this picture?", [
      { text: "No" },
      { text: "Yes", onPress: () => saveImageDetails(image, details) },
    ]);
  };

  // Saving the image to django backend
  const saveImageDetails = async (selectedImage, details) => {
    const username = await AsyncStorage.getItem("username");

    // Get GPS location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Need access to location to store image"
      );
      return;
    }
    console.log("Getting location:");
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
      timeout: 5000,
    });
    console.log(`Location found: ${location}`);
    const gpsCoordinates = `${location.coords.latitude},${location.coords.longitude}`;

    console.log(gpsCoordinates);

    //TODO: create a view function to check if the plant picture is already saved

    const formData = new FormData();
    formData.append("file", {
      uri: selectedImage.uri, // from pickImageAndSend
      type: "image/jpeg",
      name: "plant.jpg",
    });
    formData.append("scientific_name", details.scientific_name);
    formData.append("common_name", details.common_name);
    formData.append("conservation_status", details.conservation_status);
    formData.append("gps_coordinates", gpsCoordinates);
    formData.append("username", username);
    formData.append("confidence", details.confidence);

    try {
      const response = await fetch(`${CONFIG.API_URL}/save-plant-details/`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      let responseJson = await response.json();
      console.log("Response json:", responseJson);

      if (response.ok) {
        console.log("saving plant details response ok");
        let achievementsMessage = "";
        console.log("checking achievements");
        console.log(responseJson);
        if (responseJson.achievements_updates.length > 0) {
          achievementsMessage = `\nNew Achievements Unlocked: ${responseJson.achievements_updates.join(
            ", "
          )}`;
        }

        const formattedResponse = `The plant has been saved successfully.\nYour achieved score: ${responseJson.final_score_increased}\nYour Total Score: ${responseJson.total_experience_points}${achievementsMessage}`;

        Alert.alert("Save Successful!", formattedResponse);
      } else {
        console.log("Error data:", responseJson);
        const errorMessage =
          responseJson.error || "Could not save the plant details.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error saving plant details:", error);
      Alert.alert("Error", "Error saving plant details:");
    }
  };

  const testServerConnection = async () => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/test-get/`);
      const json = await response.json();
      Alert.alert("Server Response", JSON.stringify(json));
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Server Connection Error",
        "Could not connect to the server."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.optionButton, styles.optionButtonLeft]}
          onPress={pickImageFromGallery}
        >
          <Ionicons name="images-outline" size={50} color="#252900" />
          <Text style={styles.optionText}>Pick Image from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={takeImageWithCamera}
        >
          <Ionicons name="camera-outline" size={50} color="#252900" />
          <Text style={styles.optionText}>Take Image with Camera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.testServerButton}
        onPress={testServerConnection}
      >
        <Text style={styles.testServerText}>Test Server Connection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6FBF4",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "95%",
  },
  optionButton: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderColor: "#195100",
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    textAlign: "center",
  },
  optionButtonLeft: {
    marginRight: 5,
  },
  optionText: {
    marginTop: 10,
    color: "#252900",
    fontWeight: "bold",
  },
  testServerButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#195100",
  },
  testServerText: {
    color: "black",
    fontWeight: "bold",
  },
});
