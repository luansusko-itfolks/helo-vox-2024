import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { voices } from '../../config/settings';


const VoiceSelectionModal = ({ isVisible, onSelectVoice, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Voice</Text>
          {voices.map((voice) => (
            <TouchableOpacity
              key={voice.id}
              style={styles.voiceItem}
              onPress={() => onSelectVoice(voice.id)}
            >
              <Text style={styles.voiceName}>{voice.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    voiceItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#dddddd',
    },
    voiceName: {
      fontSize: 18,
      color: '#333333',
    },
  });

  export default VoiceSelectionModal;
