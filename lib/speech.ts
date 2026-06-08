"use client";

type SpeakOptions = {
  rate?: number;
  pitch?: number;
};

const maleVoiceNames = [
  /daniel/i,
  /george/i,
  /arthur/i,
  /ryan/i,
  /oliver/i,
  /thomas/i,
  /male/i,
  /google uk english male/i,
  /microsoft george/i,
  /microsoft ryan/i
];

function chooseBritishMaleVoice(voices: SpeechSynthesisVoice[]) {
  const isEnglish = (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase().startsWith("en");
  const isBritish = (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase().startsWith("en-gb");
  const soundsMale = (voice: SpeechSynthesisVoice) => maleVoiceNames.some((pattern) => pattern.test(voice.name));

  return (
    voices.find((voice) => isBritish(voice) && soundsMale(voice)) ??
    voices.find((voice) => isBritish(voice)) ??
    voices.find((voice) => isEnglish(voice) && soundsMale(voice)) ??
    voices.find(isEnglish)
  );
}

export function speakBritishMale(text: string, options: SpeakOptions = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  let spoken = false;

  const speak = () => {
    if (spoken) return;
    spoken = true;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = options.rate ?? 0.86;
    utterance.pitch = options.pitch ?? 0.82;
    utterance.voice = chooseBritishMaleVoice(synth.getVoices()) ?? null;
    synth.speak(utterance);
  };

  if (synth.getVoices().length > 0) {
    speak();
    return;
  }

  synth.addEventListener("voiceschanged", speak, { once: true });
  window.setTimeout(speak, 250);
}
