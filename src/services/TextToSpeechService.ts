import axios from 'axios';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import HistoryManager from '../history/HistoryManager';
import { encode as btoa } from 'base-64';

let currentVoiceId = '';

const TextToSpeechService = {
  setVoiceId: (voiceId) => {
    currentVoiceId = voiceId;
  },

  generateAudio: async (text) => {
    try {
      console.log('Voice ID usado no serviço de TTS:', currentVoiceId);
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${currentVoiceId}?optimize_streaming_latency=0&output_format=mp3_44100_128`,
        {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0,
            similarity_boost: 0,
            style: 0,
            use_speaker_boost: true,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': 'aa93006c6fb22b75239fe4cf9a02c553',
          },
          responseType: 'arraybuffer',
        }
      );

      let audioUrl;
      if (Platform.OS === 'web') {
        const blob = new Blob([response.data], { type: 'audio/mpeg' });
        audioUrl = URL.createObjectURL(blob);
      } else {
        const filePath = `${RNFS.DocumentDirectoryPath}/ttsAudio_${new Date().getTime()}.mp3`;
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(response.data)));
        await RNFS.writeFile(filePath, base64Audio, 'base64');
        audioUrl = filePath;
      }

      await HistoryManager.addToHistory({ originalText: text, translatedText: text, audioUrl });

      return { audioUrl };
    } catch (error) {
      console.error('Error in generating TTS audio:', error);
      throw new Error('Failed to generate audio');
    }
  },
};

export default TextToSpeechService;