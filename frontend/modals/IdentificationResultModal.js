import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";


const IdentificationResultModal = ({ visible, onClose, result }) => {
  const { scientific_name, common_name, confidence, conservation_status } = result;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Identification Results</Text>
          <Text style={styles.resultText}>Scientific Name: {scientific_name}</Text>
          <Text style={styles.resultText}>Common Name: {common_name}</Text>
          <Text style={styles.modalText}>Confidence: {result.confidence ? result.confidence.toFixed(2) : 'N/A'}</Text>
          <Text style={styles.resultText}>Conservation Status: {conservation_status}</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default IdentificationResultModal;



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: "#F6FBF4",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#195100",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
