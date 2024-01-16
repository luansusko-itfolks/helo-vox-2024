import axios from 'axios';

const TranslationService = {
  async translateText(text, sourceLanguage, targetLanguage) {
    const apiKey = 'AIzaSyBwpLvboZgF7SjwK1owfbGISqwK0mTlny8';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    try {
      const response = await axios.post(url, {
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
      });

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('TranslationService.translateText:', error);
      throw new Error('Translation service failed');
    }
  }
};

export default TranslationService;