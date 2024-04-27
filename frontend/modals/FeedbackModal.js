import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "../app_config";

function FeedbackModal({ isVisible, onClose, onSubmitFeedback }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const clearForm = () => {
    setSubject("");
    setDescription("");
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleSubmit = async () => {
    // Empty form validation check
    if (!subject.trim() || !description.trim()) {
      Alert.alert(
        "Error submitting feedback",
        "Subject or description cannot be empty!"
      );
      return;
    }

    const username = await AsyncStorage.getItem("username");
    const response = await fetch(`${CONFIG.API_URL}/submit-feedback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, subject, description }),
    });

    if (response.ok) {
      onSubmitFeedback();
      clearForm();
    } else {
      console.error("Feedback submission failed");
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Feedback Form</Text>
        <Text style={styles.label}>Subject</Text>
        <TextInput
        //   placeholder=""
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
        //   placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline={true}
          numberOfLines={9}
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
    marginHorizontal: 15,
    marginVertical: 70,
    borderRadius: 15,
    borderColor: "Black",
    borderWidth: 1,
    padding: 18,
    // opacity: 80
    alignContent: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    backgroundColor: "#F6FBF4",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#F6FBF4",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    width: "50%",
    alignContent: "center",
    alignSelf: "center",
  },
  closeButtonText: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    color: "#252900",
    marginBottom: 5,
  },
});

export default FeedbackModal;
