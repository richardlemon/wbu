export const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    // You can customize the voice here if needed
    // const voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices.find(voice => voice.lang === 'nl-NL'); // Try to find Dutch voice
    utterance.lang = 'nl-NL';
    window.speechSynthesis.speak(utterance);
  }
};
