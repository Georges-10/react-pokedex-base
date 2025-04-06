import { useState } from "react";
import { toast } from "react-toastify";

import { useLoaderData } from "react-router-dom";
import Pokecard from "../components/Pokecard/Pokecard";
import { Pokemon } from "../types/pokemon";
import { pokemonFactory } from "../utils/pokemonStore";
import Error from "./Error";

export default function Home() {
  //variables

  const { pokemons: loaderPokemons, nbrMyPoke } = useLoaderData();
  // States
  const [pokemons, setPokemons] = useState<Pokemon[]>(loaderPokemons);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPokemon = async () => {
    setLoading(true);

    try {
      const load = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=30&offset=" +
          (pokemons.length - nbrMyPoke < 0
            ? pokemons.length
            : pokemons.length - nbrMyPoke),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const data = await load.json();
      const allPoke: Array<Promise<any>> = data.results.map(
        async (poke: { name: string; url: string }) => {
          const load = await fetch(poke.url);
          return await load.json();
        },
      );
      const allPokeDetails = await Promise.all(allPoke);

      const allPokemons: Pokemon[] = allPokeDetails.map((poke) => {
        return pokemonFactory(poke);
      });

      setPokemons((prev) => [...prev, ...allPokemons]);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      toast.error("Une erreur est survenu");
      setError(true);
    }
    //toast.success(`plus 30 pokemons attrapé`);
  };

  if (error) return <Error />;

  return (
    <div>
      {/* Pokemons */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 max-w-7xl mx-auto mt-10 md:p-0 p-5">
        {pokemons.map((pokemon, index) => (
          <Pokecard
            key={index}
            pokemon={pokemon}
          />
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center text-white mt-5">
          Chargement...
        </div>
      )}

      {/* Add */}
      <div className="flex justify-center my-10">
        <button
          className="bg-white hover:bg-gray-50 rounded-full text-black py-2 px-5 text-lg font-semibold shadow-lg hover:shadow-xl transition duration-150 disabled:opacity-80 disabled:cursor-wait"
          disabled={loading}
          onClick={fetchPokemon}
        >
          Encore plus de Pokémons !
        </button>
      </div>
    </div>
  );
}

export async function loader() {
  const load = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=30",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );
  let allPokemons: Pokemon[] = [];
  console.log(load.ok);
  if (!load.ok) {
    toast.error("Une erreur est survenu avec pokeApi");
  } else {
    const data = await load.json();
    const allPoke: Array<Promise<any>> = data.results.map(
      async (poke: { name: string; url: string }) => {
        const load = await fetch(poke.url);
        return await load.json();
      },
    );

    const allPokeDetails = await Promise.all(allPoke);

    allPokemons = allPokeDetails.map((poke) => {
      return pokemonFactory(poke);
    });
  }
  const myPokemons = await fetchMyPokemon();

  if (!load.ok && !myPokemons) {
    return { pokemons: [], nbrMyPoke: 0 };
  }

  return myPokemons
    ? {
        pokemons: [...myPokemons, ...allPokemons],
        nbrMyPoke: myPokemons.length,
      }
    : { pokemons: allPokemons, nbrMyPoke: 0 };
}

const fetchMyPokemon = async () => {
  try {
    const myPoke = await fetch(
      "https://pokedex-react-3a34b-default-rtdb.europe-west1.firebasedatabase.app/pokemons.json",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    const myPokeData = await myPoke.json();

    const myPokemons: Pokemon[] = Object.entries(myPokeData).map(
      ([key, obj]) => {
        return {
          id: key,
          ...(obj as Pokemon),
        };
      },
    );
    return myPokemons;
  } catch (e) {
    toast.error(
      "Une erreur est survenu lors de la com avec la base de donné",
    );
    console.log(e);
  }
};
