export default function Scoreboard({ score, best }) {
  return (
    <div className="scoreboard">
      <div className="score">Score: <strong>{score}</strong></div>
      <div className="best">Best: <strong>{best}</strong></div>
    </div>
  );
}