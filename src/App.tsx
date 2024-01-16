import React, { useState, useEffect } from 'react';
import { View, Button, ScrollView, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import InputLanguageModal from './components/modals/InputLanguageModal';
import OutputLanguageModal from './components/modals/OutputLanguageModal';
import VoiceSelectionModal from './components/modals/VoiceSelectionModal';
import { inputLanguages, outputLanguages, voices } from './config/settings';
import VoiceRecognition from './VoiceRecognition/VoiceRecognition';
import TextToSpeechService from './services/TextToSpeechService';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import playAudio from './components/AudioPlayer/AudioPlayer';
import HistoryManager from './history/HistoryManager';
import TranslationService from './services/TranslationService';
import { buttonStyles } from './styles/ButtonStyles';

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [inputLanguage, setInputLanguage] = useState('en-US');
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [selectedVoiceId, setSelectedVoiceId] = useState(voices[0].id);
  const [history, setHistory] = useState([]);
  const [inputLanguageModalVisible, setInputLanguageModalVisible] = useState(false);
  const [outputLanguageModalVisible, setOutputLanguageModalVisible] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const selectedInputLanguageName = inputLanguages.find(lang => lang.id === inputLanguage)?.name || 'None';
  const selectedOutputLanguageName = outputLanguages.find(lang => lang.id === outputLanguage)?.name || 'None';
  

  useEffect(() => {
    const fetchHistory = async () => {
      const fetchedHistory = await HistoryManager.getHistory(); 
      setHistory(fetchedHistory);
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    console.log("Idioma de saída atualizado:", selectedOutputLanguageName);
}, [selectedOutputLanguageName]);

const handleVoiceSelection = (voiceId) => {
  console.log('Voz selecionada no modal:', voiceId);
  TextToSpeechService.setVoiceId(voiceId);
  setSelectedVoiceId(voiceId);   
  setVoiceModalVisible(false);     
};

const handleVoiceRecognitionResult = async (result) => {
  setText(result);
  try {

    const currentOutputLanguage = outputLanguage;
    const translated = await TranslationService.translateText(result, inputLanguage, outputLanguage); 
    setTranslatedText(translated);

    const audioResponse = await TextToSpeechService.generateAudio(translated, selectedVoiceId);
    if (audioResponse.audioUrl) {
      AudioPlayer(audioResponse.audioUrl);

      const newItem = {
        transcribedText: result,
        translatedText: translated,
        audioUrl: audioResponse.audioUrl
      };

      HistoryManager.addToHistory(newItem);
      setHistory(prevHistory => [...prevHistory, newItem]);
    }
  } catch (error) {
    console.error('Error in processing:', error);
  }
};

const startVoiceRecognition = async () => {
  setIsListening(true);
  VoiceRecognition.startListening(inputLanguage, handleVoiceRecognitionResult, handleError);
};

const stopVoiceRecognition = async () => {
  setIsListening(false);
  if (Platform.OS === 'web') {
  
    VoiceRecognition.stopListening();
  } else {
    VoiceRecognition.stopListening();
  }
};

const handleError = (error) => {
    console.error('Voice recognition error:', error);
    setIsListening(false);
};

const handleOutputLanguageSelection = (languageId) => {
  setOutputLanguage(languageId);
  setOutputLanguageModalVisible(false);
};

const playAudioFromHistory = (url) => {
    playAudio(url);
  };
  
  return (
    <View style={styles.container}>
    <TouchableOpacity style={buttonStyles.button} onPress={() => setInputLanguageModalVisible(true)}>
    <Text style={buttonStyles.buttonText}>Language Input: {selectedInputLanguageName}
    </Text>
    </TouchableOpacity>
    <TouchableOpacity style={buttonStyles.button} onPress={() => setOutputLanguageModalVisible(true)}>
      <Text style={buttonStyles.buttonText}>Language Output: {selectedOutputLanguageName}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity style={buttonStyles.button} onPress={() => setVoiceModalVisible(true)}>
      <Text style={buttonStyles.buttonText}>Select Voice</Text>
    </TouchableOpacity>
    <TouchableOpacity style={buttonStyles.button} onPress={isListening ? stopVoiceRecognition : startVoiceRecognition}>
      <Text style={buttonStyles.buttonText}>{isListening ? 'Stop Capture' : 'Start Capture'}</Text>
    </TouchableOpacity>
      <InputLanguageModal
        isVisible={inputLanguageModalVisible}
        languages={inputLanguages}
        onSelectLanguage={(id) => {
          setInputLanguage(id);
          setInputLanguageModalVisible(false);
        }}
        onClose={() => setInputLanguageModalVisible(false)}
      />
      <OutputLanguageModal
        isVisible={outputLanguageModalVisible}
         languages={outputLanguages}
         onSelectLanguage={handleOutputLanguageSelection}
         onClose={() => setOutputLanguageModalVisible(false)}
      />
      <VoiceSelectionModal
        isVisible={voiceModalVisible}
        voices={voices}
        onSelectVoice={handleVoiceSelection}
        onClose={() => setVoiceModalVisible(false)}
      />
      <ScrollView style={styles.historyContainer}>
        {Array.isArray(history) && history.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.transcribedText}>Transcripted: {item.transcribedText}</Text>
            <Text style={styles.translatedText}>Translated: {item.translatedText}</Text>
          <Button title="Play Audio" onPress={() => playAudioFromHistory(item.audioUrl)} />
        </View>       
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  historyContainer: {
    marginTop: 20,
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  transcribedText: {
    fontSize: 16,
    marginBottom: 5,
  },
  translatedText: {
    fontSize: 14,
    color: 'gray',
  },
  historyContainer: {
    width: '100%', // ajuste conforme necessário
    padding: 10, // ajuste conforme necessário
    marginTop: 20, // espaço acima do histórico
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5, // espaço entre os itens
    elevation: 3, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default App;
