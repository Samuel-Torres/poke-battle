import { useEffect, useState, useRef } from "react";
import "./battleStyles.scss";
import { useNavigate } from "react-router-dom";

// components:
import BattleCard from "../components/battleCards/battleCard";

// types:
import { characterType } from "../globalTypes";

// music:
// @ts-ignore
import battleMusic from "../audio/battleMusic.mp3";
// @ts-ignore
import attackSound from "../audio/punch.mp3";
// @ts-ignore
import victoryMusic from "../audio/victory.mp3";
// @ts-ignore
import defeat from "../audio/defeat.mp3";

import { attackAlgo } from "../utils/algorithms";

const Battle = () => {
  const navigate = useNavigate();
  const battleSongRef = useRef(new Audio(battleMusic));
  const victoryRef = useRef(new Audio(victoryMusic));
  const defeatedRef = useRef(new Audio(defeat));
  const [user, setUser] = useState<characterType>();
  const [opponent, setOpponent] = useState<characterType>();
  const [currentTurn, setCurrentTurn] = useState<"User" | "Opponent">("User");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [userDidMiss, setUserDidMiss] = useState<boolean>(false);
  const [opponentDidMiss, setOpponentDidMiss] = useState<boolean>(false);

  const attackAudio = new Audio(attackSound);

  // user attack:
  const handleAttack = (currMove: any) => {
    user &&
      setUser({
        ...user,
        isAttacking: true,
      });

    setTimeout(() => {
      if (
        currentTurn === "User" &&
        !gameOver &&
        opponent?.hp !== undefined &&
        user
      ) {
        playAttackSound();
        const calculateAttack = attackAlgo(currMove?.power, currMove?.accuracy);
        const damageDone = calculateAttack.damage;
        const hitOrMiss = calculateAttack?.hitOrMiss;
        const newHp = Math.max(opponent.hp - damageDone, 0);

        if (hitOrMiss === "hit") {
          setOpponent({
            ...opponent,
            hp: newHp,
          });

          if (opponent?.hp - damageDone <= 0) {
            setGameOver(true);
            setWinner("User");

            setUser({
              ...user,
              isAttacking: false,
              moves: user?.moves?.map((move) => {
                if (move?.name === currMove?.name) {
                  return {
                    ...move,
                    pp: move?.pp - 1,
                  };
                }
                return move;
              }),
            });
          } else {
            setUser({
              ...user,
              isAttacking: false,
              moves: user?.moves?.map((move) => {
                if (move?.name === currMove?.name) {
                  return {
                    ...move,
                    pp: move?.pp - 1,
                  };
                }
                return move;
              }),
            });
            setCurrentTurn("Opponent");
          }
        }
        if (hitOrMiss === "miss") {
          setUserDidMiss(true);
          setUser({
            ...user,
            isAttacking: false,
            moves: user?.moves?.map((move) => {
              if (move?.name === currMove?.name) {
                return {
                  ...move,
                  pp: move?.pp - 1,
                };
              }
              return move;
            }),
          });
          setTimeout(() => {
            setUserDidMiss(false);
            setCurrentTurn("Opponent");
          }, 2000);
        }
      }
    }, 1000);
  };
  // opponent attack:
  useEffect(() => {
    if (currentTurn === "Opponent" && !gameOver && opponent?.moves && user) {
      setIsThinking(true);
      const randomMoveIndex = Math.floor(
        Math.random() * opponent?.moves.length
      );
      const selectedMove = opponent?.moves[randomMoveIndex];
      const calculateAttack = attackAlgo(
        selectedMove?.power,
        selectedMove?.accuracy
      );
      const damageDone = calculateAttack.damage;
      const hitOrMiss = calculateAttack?.hitOrMiss;
      const newHp = Math.max(opponent.hp - damageDone, 0);

      setOpponent({
        ...opponent,
        isAttacking: true,
      });
      if (hitOrMiss === "hit") {
        setTimeout(() => {
          const newHp = Math.max(user?.hp - damageDone, 0);
          setUser({ ...user, hp: newHp });
          playAttackSound();
          if (user?.hp - damageDone <= 0) {
            setGameOver(true);
            setIsThinking(false);
            setWinner("Opponent");
            setOpponent({
              ...opponent,
              isAttacking: false,
              moves: opponent?.moves?.map((move) => {
                if (move?.name === selectedMove?.name) {
                  return {
                    ...move,
                    pp: move?.pp - 1,
                  };
                }
                return move;
              }),
            });
          } else {
            setIsThinking(false);
            setOpponent({
              ...opponent,
              isAttacking: false,
              moves: opponent?.moves?.map((move) => {
                if (move?.name === selectedMove?.name) {
                  return {
                    ...move,
                    pp: move?.pp - 1,
                  };
                }
                return move;
              }),
            });
            setCurrentTurn("User");
          }
        }, 2000);
      }
      if (hitOrMiss === "miss") {
        setTimeout(() => {
          setIsThinking(false);
          setOpponentDidMiss(true);
          setOpponent({
            ...opponent,
            isAttacking: false,
            moves: opponent?.moves?.map((move) => {
              if (move?.name === selectedMove?.name) {
                return {
                  ...move,
                  pp: move?.pp - 1,
                };
              }
              return move;
            }),
          });
          setTimeout(() => {
            setOpponentDidMiss(false);
            setCurrentTurn("User");
          }, 2000);
        }, 2000);
      }
    }
  }, [currentTurn, gameOver, opponent?.hp, user?.hp]);

  // route fetching user and opponent information:
  useEffect(() => {
    const userPokemonData = localStorage.getItem("selectedPokemon");
    const opPokemonData = localStorage.getItem("opponentsPokemon");

    if (!userPokemonData || !opPokemonData) {
      setIsError(true);
      return;
    }

    const userPokemon = JSON.parse(userPokemonData);
    const opPokemon = JSON.parse(opPokemonData);

    const fetchData = async () => {
      const userMoves = userPokemon?.moves[0].map(
        (move: any) => move?.move?.url
      );

      const fetchUserMoves = async () => {
        const userMovesResponses = await Promise.all(
          userMoves.map((url: string) => fetch(url))
        );

        const userMovesData = await Promise.all(
          userMovesResponses.map((res) =>
            res.ok ? res.json() : setIsError(true)
          )
        );

        const userMovesFinal = userMovesData.map((move) => ({
          accuracy: move?.accuracy || 80,
          name: move?.name,
          power: move?.power || 30,
          pp: move?.pp || 10,
        }));

        setUser({
          hp: userPokemon?.hp,
          image: userPokemon?.image,
          name: userPokemon?.name,
          types: userPokemon?.types,
          moves: userMovesFinal,
          url: undefined,
          isAttacking: false,
        });
      };

      await fetchUserMoves();
    };

    const fetchOpData = async () => {
      const opMovesUrls = opPokemon.moves
        .slice(0, 4)
        .map((move: any) => move.move.url);

      const fetchOpponentMoves = async () => {
        const opMovesResponses = await Promise.all(
          opMovesUrls.map((url: string) => fetch(url))
        );

        const opMovesData = await Promise.all(
          opMovesResponses.map((res) =>
            res.ok ? res.json() : setIsError(true)
          )
        );

        const opMovesFinal = opMovesData.map((move) => ({
          accuracy: move?.accuracy || 80,
          name: move?.name,
          power: move?.power || 30,
          pp: move?.pp || 10,
        }));

        setOpponent({
          hp: opPokemon.stats[0].base_stat,
          image: opPokemon.sprites.other["official-artwork"].front_shiny,
          name: opPokemon.name,
          types: opPokemon.types.map((typeInfo: any) => typeInfo.type.name),
          moves: opMovesFinal,
          url: undefined,
          isAttacking: false,
        });
      };

      await fetchOpponentMoves();
    };

    fetchData();
    fetchOpData();
  }, []);
  // game music:
  useEffect(() => {
    const battleSong = battleSongRef.current;
    const defeated = defeatedRef.current;
    const victory = victoryRef.current;
    battleSong.play();

    if (gameOver && winner === "User") {
      battleSong.pause();
      victory.play();
    }

    if (gameOver && winner === "Opponent") {
      battleSong.pause();
      defeated.play();
    }

    return () => {
      battleSong.pause();
      victory.pause();
      defeated.pause();
      battleSong.currentTime = 0;
    };
  }, [gameOver, winner]);

  const playAttackSound = () => {
    attackAudio.currentTime = 0;
    attackAudio.play();
  };

  const getWinner = () => {
    if (winner === "User") {
      return `Congratulations! ${user?.name} won!`;
    }
    return `${opponent?.name} won.`;
  };

  const reset = () => {
    localStorage.removeItem("selectedPokemon");
    localStorage.removeItem("opponentsPokemon");
    navigate("/");
  };

  const maxDamage = (power: number, accuracy: number) => {
    return Math.round(power * parseFloat(`0.${accuracy}`));
  };

  const musicControls = (action: string) => {
    const battleSong = battleSongRef.current;
    if (action === "pause") {
      battleSong.pause();
      battleSong.currentTime = 0;
    }
    if (action === "play") {
      battleSong.play();
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
        <div className="battleContainer">
          <div className="pokeContainer">
            <img
              className="vs"
              src="https://res.cloudinary.com/dvz91qyth/image/upload/v1728063781/pokemon/7758673-0112870914-daqrp_r4tkpf.png"
              alt="vs text"
            />
            {user && (
              <BattleCard
                battleInfo={user}
                type="User"
                currentTurn={currentTurn}
              />
            )}
            {opponent && (
              <BattleCard
                battleInfo={opponent}
                type="Opponent"
                currentTurn={currentTurn}
              />
            )}
          </div>
          <div className="infoPanel">
            {!gameOver && <h3>{currentTurn}'s Turn</h3>}
            {userDidMiss && currentTurn === "User" && (
              <div className="missed">
                <h3>{user?.name} missed </h3>
                <span className="failEmoji">🥺</span>
                <span className="failEmoji">👉 👈</span>
              </div>
            )}
            {opponentDidMiss && currentTurn === "Opponent" && (
              <div className="missed">
                <h3>{opponent?.name} missed </h3>
                <span className="failEmoji">🥺</span>
                <span className="failEmoji">👉 👈</span>
              </div>
            )}
            {isThinking && <h3>{opponent?.name} is Thinking...</h3>}
            {gameOver && (
              <div className="missed">
                <h3>{getWinner()}</h3>
              </div>
            )}
          </div>
          <div className="controlPanel">
            {currentTurn === "User" && <h2>Choose An Attack:</h2>}
            {currentTurn === "User" && (
              <div className="controls">
                {user?.moves?.map((move, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => handleAttack(move)}
                      className="attackBtn"
                    >
                      <p>
                        Name: <br />
                        {move?.name}
                      </p>
                      <p>Uses Remaining: {move?.pp}</p>
                      <p>accuracy: {move?.accuracy}</p>
                      <p>Power: {move?.power}</p>
                      <p>Max Damage: {maxDamage(move.power, move?.accuracy)}</p>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="bottomControls">
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
              <button className="chooseNewBtn" onClick={() => reset()}>
                Choose New Pokemon
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Battle;
