import React, { useState } from "react";
import { View, Button, Image, Alert, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';


const ipAddress = "10.0.2.2";

export default function TakeImageScreen() {
  const [imageIdentified, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);

  const pickImageAndSend = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);  // Save image for later use

      const formdata = new FormData();

      const image = result.assets[0];
      
      formdata.append("file", {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: image.fileName || "uploaded_image.jpg",
      });

      try {
        let response = await fetch(`http://${ipAddress}:8000/predict/`, {
          method: "POST",
          body: formdata,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        let responseJson = await response.json();
        console.log(responseJson, "responseJson");
        setImageDetails(responseJson); // Save the details for later use
        console.log("Image details!")
        console.log(imageDetails)
        console.log("Image details! done")

        const formattedResponse = `Scientific Name: ${responseJson.scientific_name}\nCommon Name: ${responseJson.common_name}\nConfidence: ${responseJson.confidence} \nConservation Status (Rarity): ${responseJson.conservation_status}`;

        
        Alert.alert('Identification Results', formattedResponse, [
          { text: 'OK', onPress: () => showSaveConfirmation(image, responseJson) }
        ]);

      } catch (error) {
        console.error(error);
        Alert.alert(
          "Server Connection Error",
          "Could not connect to the server."
        );
      }
    }
  };

  const showSaveConfirmation = (image, details) => {
    Alert.alert(
      'Save Picture',
      'Do you want to save this picture?',
      [
        { text: 'No' },
        { text: 'Yes', onPress: () => saveImageDetails(image, details) } 
      ]
    );
  };


  // Saving the image to django backend
  const saveImageDetails = async (selectedImage, details) => {
    const username = await AsyncStorage.getItem('username');

    // if (!imageDetails) {
    //   console.error('Image details are not available.');
    //   Alert.alert('Error', 'Image details are not available.');
    //   return;
    // }

    // Get GPS location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Need access to location to store image');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const gpsCoordinates = `${location.coords.latitude},${location.coords.longitude}`;

    //TODO: create a view function to check if the plant picture is already saved

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage.uri,  // from pickImageAndSend
      type: 'image/jpeg',
      name: 'plant.jpg'
    });
    formData.append('scientific_name', details.scientific_name);
    formData.append('common_name', details.common_name);
    formData.append('conservation_status', details.conservation_status);
    formData.append('gps_coordinates', gpsCoordinates);
    formData.append('username', username);
    formData.append('confidence', details.confidence)

    try {
      const response = await fetch(`http://${ipAddress}:8000/save-plant-details/`, {
        method: 'POST',
        headers: {
          // 'Authorization': `Token ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      let responseJson = await response.json();
      console.log(responseJson)

      let achievementsMessage = '';
      if (responseJson.achievements_updates.length > 0) {
        achievementsMessage = `New Achievements Unlocked: ${responseJson.achievements_updates.join(', ')}`;
      }

        const formattedResponse = `The plant has been saved successfully.\nYour achieved score: ${responseJson.final_score_increased}\nYour Total Score: ${responseJson.total_experience_points}${achievementsMessage}`;


      if (response.ok) {
        Alert.alert('Save Succesful!', formattedResponse);
      } else {
        Alert.alert('Error', 'Could not save the plant details.');
      }
    } catch (error) {
      console.error('Error saving plant details:', error);
      Alert.alert('Error', 'An error occurred while saving plant details.');
    }
  };

  

  const testServerConnection = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:8000/test-get/`);
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <Button title='upload' onPress={openGallery}></Button> */}
      <Button title="Pick an Image from Gallery" onPress={pickImageAndSend} />
      <Button title="Test Server Connection" onPress={testServerConnection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
