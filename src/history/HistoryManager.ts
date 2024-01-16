interface HistoryItem {
  transcribedText: string;
  translatedText: string;
  audioUrl: string;
}

let history: HistoryItem[] = [];

const HistoryManager = {
  getHistory: async (): Promise<HistoryItem[]> => {
    return Promise.resolve(history);
  },
  addToHistory: (newItem: HistoryItem) => {
    console.log("Antes de adicionar ao histórico:", history);
    history = [newItem, ...history];
    console.log("Depois de adicionar ao histórico:", history);
  },  
  clearHistory: async (): Promise<void> => {
    history = [];e
    return Promise.resolve();
  },
};

export default HistoryManager;