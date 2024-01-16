import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const playAudio = (audioUrl: string) => {
  const sound = new Sound(audioUrl, '', (error) => {
    if (error) {
      console.log('Falha ao carregar o som', error);
      return;
    }
    sound.play((success) => {
      if (success) {
        console.log('Reprodução de áudio concluída com sucesso');
      } else {
        console.log('Reprodução de áudio falhou');
      }
      sound.release();
    });
  });
};

export default playAudio;
