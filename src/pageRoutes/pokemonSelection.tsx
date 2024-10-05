import React, { useEffect, useState, Suspense, useRef } from "react";
import axios from "axios";
import { previewPokemon } from "../globalTypes";
import { useNavigate } from "react-router-dom";
import "./pokemonSelection.scss";

// song:
// @ts-ignore
import pokemonTheseMusic from "../audio/themeSong.mp3";

// components:
const PreviewButtonList = React.lazy(
  () => import("../components/previewButtonList")
);
const SelectionBox = React.lazy(
  () => import("../components/selectionBox/selectionBox")
);

import { characterType } from "../globalTypes";

const PokemonSelection = () => {
  const audioRef = useRef(new Audio(pokemonTheseMusic));
  const navigate = useNavigate();
  const [previewPokemon, setPreviewPokemon] = useState<characterType>();
  const [offset, setOffSet] = useState(0);
  const [allPokemon, setAllPokemon] = useState();
  const [isError, setIsError] = useState(false);

  const fetchPreviewPokemon = async (url: string) => {
    axios
      .get(url)
      .then((res: any) => {
        setIsError(false);
        const data = res?.data;
        setPreviewPokemon({
          image: data?.sprites?.other["official-artwork"]?.front_shiny,
          name: data?.name,
          hp: data?.stats[0]?.base_stat,
          types: [...data?.types],
          moves: [data?.moves?.slice(0, 4)],
          url: url,
          isAttacking: false,
        });
      })
      .catch((err: any) => {
        setIsError(true);
      });
  };

  useEffect(() => {
    const fetchPokemonWithImages = async () => {
      // setIsFetching(true);

      try {
        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=100&offset=${offset}`
        );
        const pokemonList = res?.data?.results;

        const pokemonWithImages: any = await Promise.all(
          pokemonList.map(async (pokemon: any) => {
            const response = await axios.get(pokemon.url);
            const fetchedPokemon = response.data;

            return {
              name: pokemon.name,
              url: pokemon.url,
              image:
                fetchedPokemon?.sprites?.other["official-artwork"]?.front_shiny,
            };
          })
        );

        setAllPokemon(pokemonWithImages);
      } catch (err) {
        console.log("ERROR: ", err);
        setIsError(true);
      } finally {
        // setIsFetching(false);
      }
    };

    fetchPokemonWithImages();
  }, [offset]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleUserInteraction = async () => {
      try {
        await audio.play();
        console.log("Music started after interaction");
      } catch (err) {
        console.error("Autoplay blocked on interaction:", err);
      }
    };

    document.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const musicControls = (action: string) => {
    const audio = audioRef.current;
    if (action === "pause") {
      audio.pause();
      audio.currentTime = 0;
    }
    if (action === "play") {
      audio.play();
    }
  };

  const onClientSelect = async (selectedPokemon: previewPokemon) => {
    localStorage.setItem("selectedPokemon", JSON.stringify(selectedPokemon));

    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=1302`
      );
      const pokemons = res?.data?.results;

      const randomIndex = Math.floor(Math.random() * pokemons.length);
      const randomPokemon = pokemons[randomIndex];

      const opponentRes = await axios.get(randomPokemon.url);

      localStorage.setItem(
        "opponentsPokemon",
        JSON.stringify(opponentRes.data)
      );

      navigate("/battle");
    } catch (error) {
      console.error("Error selecting opponent Pokémon:", error);
    }
  };

  const onOffsetClick = (currOffset: number, typeClick: string) => {
    if (typeClick === "prev" && offset > 0) {
      setOffSet((currOffset -= 100));
    }
    if (typeClick === "next" && offset < 1300) {
      setOffSet((currOffset += 100));
    }
  };

  return (
    <>
      {isError ? (
        <div className="errorContainer">
          <span>🥺</span>
          <span>👉 👈</span>
          <p>Sorry an error occurred reload the page and try again</p>
        </div>
      ) : (
        <div className="selectionBoxContainer">
          {previewPokemon ? (
            <SelectionBox
              previewPokemon={previewPokemon}
              onClientSelect={onClientSelect}
            />
          ) : (
            <div className="psuedoBox">
              <div className="h1Wrapper">
                <h1>Choose A Pokemon...</h1>
              </div>
            </div>
          )}
          <Suspense fallback={<h1 className="loading">Loading Pokemon...</h1>}>
            {allPokemon && (
              <PreviewButtonList
                pokemonList={allPokemon}
                fetchPreviewPokemon={fetchPreviewPokemon}
                onOffsetClick={onOffsetClick}
                currentOffset={offset}
                musicControls={musicControls}
              />
            )}
          </Suspense>
        </div>
      )}
    </>
  );
};

export default PokemonSelection;
