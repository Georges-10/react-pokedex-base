import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { queryClient } from "../clients/queryClient";
import Pokecard from "../components/Pokecard/Pokecard";
import MyError from "../pages/Error";
import { Pokemon } from "../types/pokemon";
import { pokemonFactory } from "../utils/pokemonStore";

export default function Home() {
  const [nbrMyPoke, setNbrMyPoke] = useState(0);

  const fetchPokemon = async () => {
    try {
      const load = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=30",
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
      const myPoke = await fetchMyPokemon();
      setNbrMyPoke(myPoke.length);
      return [...myPoke, ...allPokemons];
    } catch (e: any) {
      throw new Error(e);
    }
    //toast.success(`plus 30 pokemons attrapé`);
  };

  const addPoke = async () => {
    try {
      if (!pokemons) return;
      console.log(nbrMyPoke);
      const load = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=30&offset=" +
          (pokemons.length - nbrMyPoke),

        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );
      console.log(load.ok);

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

      return [...pokemons!, ...allPokemons];
    } catch (e: any) {
      throw new Error(e);
    }
  };

  const {
    data: pokemons,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemon,
    staleTime: 0, //temps avant la mise a jours du cache mm si les data sont modifiées il attendra par defaut c'est 0
    gcTime: 1000 * 60 * 7, // temps du stockage des données en cache gcTime vaut 5 min par default
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addPoke,
    onSuccess: (data) => {
      queryClient.setQueryData(["pokemons"], data);
    },
    onError: (err) => {
      toast.error("une erreur est survenue: " + err.message);
    },
  });

  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [error, isError]);

  if (isError) {
    return <MyError />;
  }

  return (
    <div>
      {/* Pokemons */}
      <motion.div
        className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 max-w-7xl mx-auto mt-10 md:p-0 p-5"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {pokemons?.map((pokemon, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: [0.8, 1] },
            }}
            transition={{ type: "spring" }}
          >
            <Pokecard pokemon={pokemon} />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center text-white mt-5">
          Chargement...
        </div>
      )}

      {/* Add */}
      <div className="flex justify-center my-10">
        <button
          className="bg-white hover:bg-gray-50 rounded-full text-black py-2 px-5 text-lg font-semibold shadow-lg hover:shadow-xl transition duration-150 disabled:opacity-80 disabled:cursor-wait"
          disabled={isPending}
          onClick={() => mutate()}
        >
          Encore plus de Pokémons !
        </button>
      </div>
    </div>
  );
}

const fetchMyPokemon = async () => {
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
  if (!myPokeData) {
    return Array<Pokemon>();
  }
  const myPokemons: Pokemon[] = Object.entries(myPokeData).map(
    ([key, obj]) => {
      return {
        id: key,
        ...(obj as Pokemon),
      };
    },
  );
  return myPokemons;
};
