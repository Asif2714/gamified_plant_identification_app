
import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet,Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';

const options = {
  title: 'Select Image',
  type: 'library',
  options: {
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
}
}

const ipAddress = '10.47.5.125';

export default function App() {

  const [image, setImage] = useState(null);

  const pickImageAndSend = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        const formdata = new FormData()

        //TODO: remove logging
        const image = result.assets[0];
        console.log("This is image" + image);

        formdata.append('file', {
          uri: image.uri,
          type: image.mimeType || 'image/jpeg',
          name: image.fileName || 'uploaded_image.jpg'
        })
        

        try {
          let response = await fetch(
            `http://${ipAddress}:8000/predict/`,
            {
              method: 'post',
              body: formdata,
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            }
          );

        let responseJson = await response.json();
        console.log(responseJson, "responseJson")
        Alert.alert('Server Response', JSON.stringify(responseJson));
  
        } catch (error) {
              console.error(error);
              Alert.alert('Server Connection Error', 'Could not connect to the server.');
        }
      };

      const testServerConnection = async () => {
            try {
              const response = await fetch(`http://${ipAddress}:8000/test-get/`);
              const json = await response.json();
              Alert.alert('Server Response', JSON.stringify(json));
            } catch (error) {
              console.error(error);
              Alert.alert('Server Connection Error', 'Could not connect to the server.');
            }
          };

  return (
    <View
    style={{flex:1, alignItems:'center', justifyContent:'center'}}>
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


