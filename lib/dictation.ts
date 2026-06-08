export type ComparedWord = {
  word: string;
  status: "correct" | "wrong" | "missing";
};

function normalizeWords(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, "")
    .split(/\s+/)
    .filter(Boolean);
}

export function scoreDictation(target: string, userInput: string) {
  const targetWords = normalizeWords(target);
  const userWords = normalizeWords(userInput);
  let correctWords = 0;

  const compared: ComparedWord[] = targetWords.map((word, index) => {
    if (!userWords[index]) {
      return { word, status: "missing" };
    }

    if (userWords[index] === word) {
      correctWords += 1;
      return { word, status: "correct" };
    }

    return { word: userWords[index], status: "wrong" };
  });

  const score = targetWords.length === 0 ? 0 : Math.round((correctWords / targetWords.length) * 100);

  return {
    score,
    compared,
    correctWords,
    totalWords: targetWords.length
  };
}
