import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { queryClient } from "../clients/queryClient";
import MakeForm from "../components/MakeForm/MakeForm";
import Pokecard from "../components/Pokecard/Pokecard";
import { useFetch } from "../hooks/useFetch";
import { Pokemon } from "../types/pokemon";
import { pokemonFactory } from "../utils/pokemonStore";
import MyError from "./Error";
export default function PokemonDetails() {
  // Refs
  // Refs
  const name = useRef<HTMLInputElement>(null);
  const height = useRef<HTMLInputElement>(null);
  const weight = useRef<HTMLInputElement>(null);
  const hp = useRef<HTMLInputElement>(null);
  const attack = useRef<HTMLInputElement>(null);
  const defense = useRef<HTMLInputElement>(null);
  const specialAttack = useRef<HTMLInputElement>(null);
  const specialDefense = useRef<HTMLInputElement>(null);
  const speed = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLInputElement>(null);
  const types = useRef<Record<string, HTMLInputElement>>({});

  const { id } = useParams();
  const isNaNId = isNaN(id);
  const [loading, setLoading] = useState(false);
  const [updatePokemon, setUpdatePokemon] = useState(false);

  const navigate = useNavigate();
  const fetchData = () =>
    useFetch(
      isNaNId
        ? `https://pokedex-react-3a34b-default-rtdb.europe-west1.firebasedatabase.app/pokemons/${id}.json`
        : "https://pokeapi.co/api/v2/pokemon/" + id,
      undefined,
      (dta: any) => {
        if (isNaNId) dta.id = id;
        return isNaN(id)
          ? (dta as unknown as Pokemon)
          : pokemonFactory(dta);
      },
    );

  const onUpdatePokemonHandler = async (updatedPokemon: Pokemon) => {
    // Loop on types to add them to pokemon if checked
    const typesKeys = Object.keys(types.current);
    typesKeys.forEach((type) => {
      if (types.current[type].checked) {
        updatedPokemon.types.push(type);
      }
    });

    const response = await fetch(
      `https://pokedex-react-3a34b-default-rtdb.europe-west1.firebasedatabase.app/pokemons/${id}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPokemon),
      },
    );
    if (response.ok) toast.info("modification prise en compte");
    else {
      throw new Error(
        "une erreur est survenue durant le modification ",
      ); //les erreur sont généré dans le mutate sinon throw prend le dessus
    }
  };

  const beforUpdate = () => {
    setLoading(true);
    const updatedPokemon: Pokemon = {
      // General
      id,
      height: Number(height.current?.value) / 10 || 0, // cm to decimeter
      weight: Number(weight.current?.value) * 10 || 0,
      name: name.current?.value || "",
      states: {
        hp: Number(hp.current?.value) || 0,
        attack: Number(attack.current?.value) || 0,
        defense: Number(defense.current?.value) || 0,
        specialAttack: Number(specialAttack.current?.value) || 0,
        specialDefense: Number(specialDefense.current?.value) || 0,
        speed: Number(speed.current?.value) || 0,
      },
      image: image.current?.value || "",
      types: [],
    };
    mutateUpdatePoke(updatedPokemon);
    setLoading(false);
  };
  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pokemon", { id }],
    queryFn: fetchData,
  });

  const {
    mutate: mutateUpdatePoke,
    isError: updateIsError,
    error: updateError,
  } = useMutation({
    mutationFn: onUpdatePokemonHandler,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pokemon", { id }],
        exact: true, //exactement tout le tableau de key(&) sinon ||
      });
      setUpdatePokemon(false);
    },
    onMutate: (updatedPokemon) => {
      const previousUpdate: Pokemon | undefined =
        queryClient.getQueryData(["pokemon", { id }]);
      queryClient.setQueryData(["pokemon", { id }], updatedPokemon);
      return { previousUpdate };
    },
    onError: (
      err,
      variable,
      context:
        | {
            previousUpdate: Pokemon | undefined;
          }
        | undefined,
    ) => {
      setUpdatePokemon(false);
      toast.error(err.message);
      queryClient.setQueryData(
        ["pokemon", { id }],
        context?.previousUpdate,
      );
    },
  });

  // Modale
  useEffect(() => {
    if (updatePokemon) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [updatePokemon]);

  const onDeletePokemonHandler = async () => {
    // Delete
    if (
      window.confirm("Voulez-vous vraiment supprimer ce pokémon ?")
    ) {
      setLoading(true);
      const deleted = await fetch(
        `https://pokedex-react-3a34b-default-rtdb.europe-west1.firebasedatabase.app/pokemons/${id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (deleted.ok) {
        toast.info(`le pokemon ${pokemon?.name} à bien été supprimé`);
      } else {
        throw new Error(
          `Une erreur est survenue lors de la suppression de ${pokemon?.name} `,
        );
      }
      setLoading(false);
    }
  };

  const { mutate } = useMutation({
    mutationFn: onDeletePokemonHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pokemons"] });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (loading || isLoading)
    return <div className="text-center">Chargement...</div>;
  if (isError) {
    toast.error("Une erreur c'est Produite :" + error?.message);
    return <MyError />;
  }

  if (!pokemon || !pokemon.name) return;

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
    >
      <Pokecard
        pokemon={pokemon}
        details
      />
      {isNaN(id!) && (
        <div className="flex justify-end gap-4 mt-5">
          <div
            className="text-yellow-pokemon font-semibold hover:text-yellow-300 cursor-pointer"
            onClick={() => setUpdatePokemon(true)}
          >
            Modifier
          </div>
          <div
            className="text-yellow-pokemon font-semibold hover:text-yellow-300 cursor-pointer"
            onClick={() => mutate()}
          >
            Supprimer
          </div>
        </div>
      )}
      {createPortal(
        <AnimatePresence>
          {updatePokemon && (
            <div className="bg-black bg-opacity-90 fixed top-0 right-0 bottom-0 left-0 flex justify-center text-black">
              <motion.div
                className="p-8 bg-white cursor-auto rounded-xl max-w-xl w-full my-10 overflow-y-auto"
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                animate="visible"
                initial="hidden"
                exit="hidden"
              >
                {/* Close */}
                <div className="flex justify-end text-black hover:text-yellow-pokemon cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUpdatePokemon(false);
                    }}
                  >
                    <g fill="currentColor">
                      <path d="M10.03 8.97a.75.75 0 0 0-1.06 1.06L10.94 12l-1.97 1.97a.75.75 0 1 0 1.06 1.06L12 13.06l1.97 1.97a.75.75 0 0 0 1.06-1.06L13.06 12l1.97-1.97a.75.75 0 1 0-1.06-1.06L12 10.94l-1.97-1.97Z"></path>
                      <path
                        fillRule="evenodd"
                        d="M12.057 1.25h-.114c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529v-.114c0-2.309 0-4.118-.19-5.53c-.194-1.444-.6-2.584-1.494-3.479c-.895-.895-2.035-1.3-3.48-1.494c-1.411-.19-3.22-.19-5.529-.19ZM3.995 3.995c.57-.57 1.34-.897 2.619-1.069c1.3-.174 3.008-.176 5.386-.176s4.086.002 5.386.176c1.279.172 2.05.5 2.62 1.069c.569.57.896 1.34 1.068 2.619c.174 1.3.176 3.008.176 5.386s-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62Z"
                        clipRule="evenodd"
                      ></path>
                    </g>
                  </svg>
                </div>

                <h2 className="text-3xl font-semibold mb-5">
                  Modifier un pokémon
                </h2>

                <MakeForm
                  nameRef={name}
                  heightRef={height}
                  weightRef={weight}
                  hpRef={hp}
                  attackRef={attack}
                  defenseRef={defense}
                  specialAttackRef={specialAttack}
                  specialDefenseRef={specialDefense}
                  speedRef={speed}
                  imageRef={image}
                  typesRef={types}
                  onFormSubmittedHandler={beforUpdate}
                  pokemon={pokemon}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </motion.div>
  );
}
