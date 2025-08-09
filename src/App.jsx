import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleArray, pickUniqueIds } from "./components/UniqueShuffled.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import { fetchPokemonById, preloadImages } from "./components/FetchImage.jsx";
import { Card, Loader } from "./components/Card.jsx";
import './App.css';

const MAX_POKEDEX = 649;
const CARD_COUNT = 14;

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [displayOrder, setDisplayOrder] = useState([]);
  const clickedRef = useRef(new Set());
  const [score, setScore] = useState(0);

  const [best, setBest] = useState(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("bestScore") : null;
      return raw ? Number(raw) : 0;
    } catch {
      return 0;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startRound = useCallback(async () => {
    setLoading(true);
    setError(null);
    clickedRef.current = new Set();
    setScore(0);

    try {
      const ids = pickUniqueIds(CARD_COUNT, MAX_POKEDEX);
      const fetches = ids.map((id) => fetchPokemonById(id));
      const results = await Promise.all(fetches);

      await preloadImages(results);

      setPokemons(results);
      setDisplayOrder(shuffleArray(results));
    } catch (err) {
      console.error(err);
      setError("Failed to load pokemons. Try again.");
      setPokemons([]);
      setDisplayOrder([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const persistBestIfNeeded = useCallback((candidate) => {
    setBest((prev) => {
      const nb = Math.max(prev, candidate);
      if (nb !== prev) {
        try { localStorage.setItem("bestScore", String(nb)); } 
        catch {
          // ...
        }
      }
      return nb;
    });
  }, []);

  const handleCardClick = useCallback((id) => {
    if (loading) return;

    if (clickedRef.current.has(id)) {
      const currentScore = score;
      persistBestIfNeeded(currentScore);

      setTimeout(() => startRound(), 300);
      return;
    }

    clickedRef.current.add(id);
    setScore(clickedRef.current.size);

    setDisplayOrder((prev) => shuffleArray(prev));

    if (clickedRef.current.size === pokemons.length && pokemons.length > 0) {
      const newScore = clickedRef.current.size;
      persistBestIfNeeded(newScore);

      setTimeout(() => startRound(), 600);
    }
  }, [loading, score, pokemons.length, persistBestIfNeeded, startRound]);

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Pokémon Clicky Memory</h1>
        <p className="sub">Click each card only once. Cards shuffle after every click.</p>
        <Scoreboard score={score} best={best} />
      </header>

      <main className="app-main">
        {loading && <Loader />}
        {error && (
          <div className="error">
            <div>{error}</div>
            <button onClick={startRound} className="btn">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <section className="grid" role="list">
            {displayOrder.map((p) => (
              <Card key={p.id} pokemon={p} onClick={handleCardClick} disabled={loading} />
            ))}
          </section>
        )}
      </main>

      <footer className="app-footer">
        <div>Round images are fetched on start and remain the same until you fail or win.</div>
        <div className="controls">
          <button className="btn" onClick={startRound} disabled={loading}>New Round</button>
        </div>
      </footer>

    </div>
  );
}