const getRandomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getHitOrMiss = (accuracy: number) => {
  const randomNumber = getRandomInRange(0, 100);

  if (randomNumber > accuracy) {
    return "miss";
  }
  return "hit";
};

export const attackAlgo = (power: number, accuracy: number) => {
  const powerMin: number = Math.round(power / 2);
  const powerMax: number = Math.round(power * parseFloat(`0.${accuracy}`));
  const damageToBeDealt: number = getRandomInRange(powerMin, powerMax);
  return {
    damage: damageToBeDealt,
    hitOrMiss: getHitOrMiss(accuracy),
  };
};
