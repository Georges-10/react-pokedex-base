import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MakeForm from "../components/MakeForm/MakeForm";
import Pokecard from "../components/Pokecard/Pokecard";
import { useFetch } from "../hooks/useFetch";
import { Pokemon } from "../types/pokemon";
import { pokemonFactory } from "../utils/pokemonStore";
import Error from "./Error";

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
  //const pokemon = useLoaderData() as Pokemon;
  const [loading, setLoading] = useState(false);
  const [updatePokemon, setUpdatePokemon] = useState(false);
  // const [loadingPokemon, setloadingPokemon] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon>();
  const navigate = useNavigate();
  const {
    data,
    loading: loadingPokemon,
    error,
  } = useFetch(
    isNaNId
      ? `https://pokedex-react-3a34b-default-rtdb.europe-west1.firebasedatabase.app/pokemons/${id}.json`
      : "https://pokeapi.co/api/v2/pokemon/" + id,
    undefined,
    (dta: any) => {
      if (isNaNId) dta.id = id;
      const res = isNaN(id)
        ? (dta as unknown as Pokemon)
        : pokemonFactory(dta);
      setPokemon(res);
    },
  );

  // Modale
  useEffect(() => {
    if (updatePokemon) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [updatePokemon]);

  const onUpdatePokemonHandler = async () => {
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

    // Loop on types to add them to pokemon if checked
    const typesKeys = Object.keys(types.current);
    typesKeys.forEach((type) => {
      if (types.current[type].checked) {
        updatedPokemon.types.push(type);
      }
    });
    const pokemonBefore = {} as Pokemon;
    Object.assign(pokemonBefore, pokemon);

    setUpdatePokemon(false);
    setPokemon(updatedPokemon);
    setLoading(false);

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
      toast.error("une erreur est survenue");
      setPokemon(pokemonBefore);
    }
  };
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
        toast.error(
          `Une erreur est survenue lors de la suppression de ${pokemon?.name} `,
        );
      }
      setLoading(false);
      navigate("/");
    }
  };

  if (loading || loadingPokemon)
    return <div className="text-center">Chargement...</div>;
  if (error) {
    toast.error("Une erreur c'est Produite");
    return <Error />;
  }

  if (!pokemon || !pokemon.name) return;

  return (
    <div className="max-w-7xl mx-auto">
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
            onClick={onDeletePokemonHandler}
          >
            Supprimer
          </div>
        </div>
      )}

      {updatePokemon &&
        createPortal(
          <div className="bg-black bg-opacity-90 fixed top-0 right-0 bottom-0 left-0 flex justify-center text-black">
            <div className="p-8 bg-white cursor-auto rounded-xl max-w-xl w-full my-10 overflow-y-auto">
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
                onFormSubmittedHandler={onUpdatePokemonHandler}
                pokemon={pokemon}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
