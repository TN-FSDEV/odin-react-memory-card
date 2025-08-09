import React from 'react'
const Card = React.memo(function Card({ pokemon, onClick, disabled }) {
  return (
    <button
      className={`card ${disabled ? "disabled" : ""}`}
      onClick={() => onClick(pokemon.id)}
      disabled={disabled}
      aria-label={`Card ${pokemon.name}`}
    >
      <div className="card-inner">
        {pokemon.sprite ? (
          <img src={pokemon.sprite} alt={pokemon.name} className="card-img" />
        ) : (
          <div className="card-placeholder">No image</div>
        )}
        <div className="card-name">{pokemon.name}</div>
      </div>
    </button>
  );
});

function Loader() {
  return (
    <div className="loader">Loading...</div>
  );
}

export {Card, Loader};