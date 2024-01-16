import React, { useState, useEffect } from 'react';

const VoiceRecognitionWeb = {
  startListening: (inputLanguage, onResult, onError) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Web Speech API não é suportada neste navegador.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = inputLanguage;

    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      onError(event.error);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting voice recognition:', e);
      onError(e);
    }

    VoiceRecognitionWeb.stopListening = () => {
      recognition.stop();
    };
  },

  stopListening: () => {
    // Esta função será substituída quando startListening for chamada
  },
};

export default VoiceRecognitionWeb;