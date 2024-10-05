type pokemonList = {
  name: string;
  url: string;
  image: string;
  fetchPreviewPokemon: Function;
};

const PreviewCard = ({
  name,
  url,
  fetchPreviewPokemon,
  image,
}: pokemonList) => {
  return (
    <div className="previewCardContainer">
      <button onClick={() => fetchPreviewPokemon(url)} className="pokeBtn">
        <img className="pokeImage" src={image} alt="pokemon image" />
        {name}
      </button>
    </div>
  );
};

export default PreviewCard;
