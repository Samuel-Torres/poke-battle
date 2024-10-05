import { useState, useEffect } from "react";
import { previewPokemon } from "../../globalTypes";
import "./selectionBox.scss";

type pokemonProps = {
  previewPokemon: previewPokemon;
  onClientSelect: Function;
};

const SelectionBox = ({ previewPokemon, onClientSelect }: pokemonProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [delayedPokemon, setDelayedPokemon] = useState<previewPokemon | null>(
    null
  );

  useEffect(() => {
    setIsFlipped(false);

    const flipTimeout = setTimeout(() => {
      setIsFlipped(true);

      const updateTimeout = setTimeout(() => {
        setDelayedPokemon(previewPokemon);
      }, 250);

      return () => clearTimeout(updateTimeout);
    }, 500);

    return () => clearTimeout(flipTimeout);
  }, [previewPokemon]);

  return (
    <div className="selectionBox">
      <div className="blackBorder">
        <div className={`selectCard ${isFlipped ? "" : "flipped"}`}>
          {/* Front Side */}
          <div className="cardFront">
            <div className="nameContainer">
              <p>Name: {delayedPokemon?.name}</p>
              <p>HP: {delayedPokemon?.hp}</p>
            </div>
            <div className="imgContainer">
              <img
                className="pokemonImg"
                src={delayedPokemon?.image}
                alt="users pokemon"
              />
            </div>
            <div className="bottomSection">
              <p>
                Types:
                {delayedPokemon?.types.map((type) => {
                  return ` ${type?.type?.name}, `;
                })}
              </p>
              <p>
                Moves:
                {delayedPokemon?.moves[0].map((move: any) => {
                  return ` ${move?.move?.name}, `;
                })}
              </p>
              <div>
                <button onClick={() => onClientSelect(delayedPokemon)}>
                  Battle With {delayedPokemon?.name}
                </button>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="cardBack">
            <img
              src="https://res.cloudinary.com/dvz91qyth/image/upload/v1727922672/pokemon/t9ly7ltc9un81_nkdnst.webp" /* Replace with your image path */
              alt="Card Back"
              className="backImage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionBox;
