export type previewPokemon = {
  image: string;
  name: string;
  hp: number;
  types: any[];
  moves: any[];
};

export type characterType = {
  hp: number;
  image: string;
  name: string;
  types: string[];
  moves: Array<{
    accuracy: number;
    name: string;
    power: number;
    pp: number;
  }>;
  url: string | undefined;
  isAttacking: boolean;
};
