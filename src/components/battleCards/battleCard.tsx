import { useState, useEffect } from "react";
import "./battleCard.scss";

// types:
import { characterType } from "../../globalTypes";

type battleCardProps = {
  battleInfo: characterType;
  type: "User" | "Opponent";
  currentTurn: "User" | "Opponent";
};

const BattleCard = ({ battleInfo, type, currentTurn }: battleCardProps) => {
  const [displayedHp, setDisplayedHp] = useState(battleInfo.hp);

  useEffect(() => {
    if (battleInfo.hp < displayedHp) {
      const interval = setInterval(() => {
        setDisplayedHp((prevHp) => {
          const nextHp = prevHp - 1;

          if (nextHp <= battleInfo.hp) {
            clearInterval(interval);
            return battleInfo.hp;
          }

          return nextHp;
        });
      }, 20);

      return () => clearInterval(interval);
    }
  }, [battleInfo.hp, displayedHp]);

  return (
    <div className="battleCardContainer">
      <div className="characterInfo">
        <p>{battleInfo?.name}</p>
        <p>Health: {displayedHp}</p>
      </div>
      <div className="imageContainer">
        <img
          className={`image ${
            currentTurn === "User" && type === "User"
              ? "userBounceAnimation"
              : null
          } ${
            currentTurn === "Opponent" && type === "Opponent"
              ? "opponentBounceAnimation"
              : null
          } 
           ${
             currentTurn === "User" &&
             type === "User" &&
             battleInfo?.isAttacking
               ? "userAttack"
               : null
           }
           ${
             currentTurn === "Opponent" &&
             type === "Opponent" &&
             battleInfo?.isAttacking
               ? "opponentAttack"
               : null
           }
            
          `}
          src={battleInfo?.image}
          alt="user pokemon"
        />
      </div>
    </div>
  );
};

export default BattleCard;
