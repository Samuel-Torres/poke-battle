import "./previewButton/previewButtonStyles.scss";
import "./previewButtonList.scss";

// components:
import PreviewButton from "./previewButton/previewButton";

type previewProps = {
  pokemonList: Array<{
    name: string;
    url: string;
    image: string;
  }>;
  fetchPreviewPokemon: Function;
  onOffsetClick: Function;
  musicControls: Function;
  currentOffset: number;
};

const PreviewButtonList = ({
  pokemonList,
  fetchPreviewPokemon,
  onOffsetClick,
  currentOffset,
  musicControls,
}: previewProps) => {
  return (
    <div className="prevBtnContainer">
      <div className="previewButtonContainer">
        {pokemonList ? (
          pokemonList.map((pokemon: any, index: number) => {
            return (
              <PreviewButton
                key={index}
                name={pokemon?.name}
                url={pokemon?.url}
                image={pokemon?.image}
                fetchPreviewPokemon={fetchPreviewPokemon}
              />
            );
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="paginationBtns">
        <div className="musicControlContainer">
          <img
            onClick={() => musicControls("play")}
            className="musicControlIcons"
            src="https://res.cloudinary.com/dvz91qyth/image/upload/v1727920621/pokemon/play-button-arrowhead_yquuak.png"
            alt="play"
          />
          <img
            onClick={() => musicControls("pause")}
            className="musicControlIcons"
            src="https://res.cloudinary.com/dvz91qyth/image/upload/v1727920621/pokemon/pause_bzve37.png"
            alt="pause"
          />
        </div>
        <div className="paginationbtnContainer">
          <button
            className="leftArrow"
            onClick={() => onOffsetClick(currentOffset, "prev")}
          >
            <img
              src="https://res.cloudinary.com/dvz91qyth/image/upload/v1725830393/rillamedia/right-arrow_x2stef.png"
              alt="arrow"
            />
          </button>
          <button
            className="rightArrow"
            onClick={() => onOffsetClick(currentOffset, "next")}
          >
            <img
              src="https://res.cloudinary.com/dvz91qyth/image/upload/v1725830393/rillamedia/right-arrow_x2stef.png"
              alt="arrow"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewButtonList;
