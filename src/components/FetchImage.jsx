async function fetchPokemonById(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${id}`);
  const data = await res.json();

  const animated =
    data?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.["front_default"] ||
    data?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.["front-default"] ||
    null;

  const sprite = animated || data?.sprites?.front_default || data?.sprites?.other?.["official-artwork"]?.["front_default"] || null;

  return {
    id: data.id,
    name: data.name,
    sprite,
  };
}

function preloadImages(items) {
  return Promise.all(
    items.map(
      (p) =>
        new Promise((resolve) => {
          if (!p.sprite) return resolve();
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = p.sprite;
        })
    )
  );
}

export {fetchPokemonById, preloadImages};