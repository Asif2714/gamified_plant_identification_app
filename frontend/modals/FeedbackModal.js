import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "../app_config";

function FeedbackModal({ isVisible, onClose, onSubmitFeedback }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const clearForm = () => {
    setSubject('');
    setDescription('');
  };


  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleSubmit = async () => {
    const username = await AsyncStorage.getItem("username");
    const response = await fetch(`${CONFIG.API_URL}/submit-feedback/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, subject, description }),
    });


    if (response.ok) {
      onSubmitFeedback();
      clearForm();
    } else {
      console.error('Feedback submission failed');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Feedback Form</Text>
        <TextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline={true}
          numberOfLines={3}
        />
        <TouchableOpacity style={styles.closeButton} onPress={handleSubmit}>
          <Text style={styles.closeButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 100, 
    borderRadius: 20,
    borderColor: "Black",
    borderWidth: 2,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: "#F6FBF4",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#F6FBF4",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#252900",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FeedbackModal;