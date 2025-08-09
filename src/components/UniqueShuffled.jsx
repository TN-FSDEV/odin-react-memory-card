function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUniqueIds(count, maxId) {
  const ids = Array.from({ length: maxId }, (_, i) => i + 1);
  return shuffleArray(ids).slice(0, count);
}

export {shuffleArray, pickUniqueIds};