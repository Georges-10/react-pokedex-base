import { Pokemon } from "../types/pokemon";

export const pokemonStore: Pokemon[] = [];

export function getPokemonById(id: string) {
  return pokemonStore.find((p) => p.id?.toString() === id);
}

export function setPokemonList(pokemons: Pokemon[]) {
  pokemonStore.push(...pokemons);
}

export function pokemonFactory(poke: any): Pokemon {
  return {
    id: poke.id,
    name: poke.name,
    height: poke.height,
    weight: poke.weight,
    states: {
      hp: poke.stats[0].base_stat,
      attack: poke.stats[1].base_stat,
      defense: poke.stats[2].base_stat,
      specialAttack: poke.stats[3].base_stat,
      specialDefense: poke.stats[4].base_stat,
      speed: poke.stats[5].base_stat,
    },
    image: poke.sprites.other.home.front_default,
    types: poke.types.map((obj: any) => obj.type.name),
  };
}
