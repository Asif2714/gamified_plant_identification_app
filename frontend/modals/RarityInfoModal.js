import React from 'react';
import { View, Text, StyleSheet, Modal, Button, TouchableOpacity } from "react-native";
import { Linking } from 'react-native';


const RarityInfoModal = ({ visible, onClose }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            CR - Critically Endangered: At extremely high risk of extinction
          </Text>
          <Text style={styles.modalText}>
            EN - Endangered: At high risk of extinction
          </Text>
          <Text style={styles.modalText}>
            VU - Vulnerable: There risk of endangerment in the wild.
          </Text>
          <Text style={styles.modalText}>
            NT - Near Threatened: Likely to become endangered.
          </Text>
          <Text style={styles.modalText}>
            LC - Least Concern: Lowest risk; does not qualify for a higher risk
            category.
          </Text>
          <Text style={styles.modalText}>
            Not Listed: Not listed in the IUCN Red List yet
          </Text>
  
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.iucnredlist.org/")}
          >
            <Text style={styles.linkText}>
              Learn more on the IUCN Red List website
            </Text>
          </TouchableOpacity>
  
          <Button title="Close" onPress={onClose} />
        </View>
      </Modal>
    );
  };
  
  export default RarityInfoModal;


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
      linkText: {
        fontSize: 16,
        color: "#1A5B8C",
        marginTop: 20,
        fontWeight: "bold",
      },
      closeButton: {
        marginTop: 20,
        backgroundColor: "#F6FBF4",
        color: "195100",
        padding: 10,
        borderRadius: 10,
      },
      closeButtonText: {
        color: "252900",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold", // TODO: Color not workign for close button, investigate
      },
  });