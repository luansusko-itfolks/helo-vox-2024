const playAudio = (audioUrl: string) => {
  const audio = new Audio(audioUrl);
  audio.play().catch((error) => {
    console.error("Erro ao reproduzir o áudio:", error);
  });
};

export default playAudio;