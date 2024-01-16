import Voice from '@react-native-community/voice';

const VoiceRecognitionNative = {
  startListening: async (inputLanguage, onResult, onError) => {
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        onResult(e.value[0]);
      }
    };

    Voice.onSpeechError = (e) => {
      onError(e.error.message);
    };

    try {
      await Voice.start(inputLanguage);
    } catch (e) {
      console.error('Error starting voice recognition:', e);
      onError(e);
    }
  },

  stopListening: async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
    }
  },
};

export default VoiceRecognitionNative;