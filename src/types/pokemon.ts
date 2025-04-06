export interface Pokemon {
  id?: number | string;
  name: string;
  height: number;
  weight: number;
  states: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };

  image: string;
  types: string[];
}
