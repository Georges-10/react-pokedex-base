import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { queryClient } from "../clients/queryClient";
import MakeForm from "../components/MakeForm/MakeForm";
import { Pokemon } from "../types/pokemon";

export default function CreatePokemon() {
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
  let navigate = useNavigate();
  // Function
  const onCreateNewPokemon = async () => {
    const newPoke: Pokemon = {
      name: name.current?.value || "",
      height: Number(height.current?.value) / 10 || 0, // cm to decimeter
      weight: Number(weight.current?.value) * 10 || 0,

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
        newPoke.types.push(type);
      }
    });
    // Add to firebase realtime
    const response = await fetch(
      "https://pokedex-react-3a34b-default-rtdb.europe-west1.firebasedatabase.app/pokemons.json",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newPoke),
      },
    );
    if (!response.ok) {
      throw new Error("Une erreur est survenu lors de création");
    }
    const { name: newPokeId } = await response.json();
    return newPokeId;
  };

  const { mutate } = useMutation({
    mutationFn: onCreateNewPokemon,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pokemons"] });
      navigate(`/pokemon/${data}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-semibold text-center mb-10">
        Créer un pokémon
      </h1>
      <div className="m-5 max-w-xl mx-auto p-10 bg-yellow-pokemon rounded-xl bg-opacity-10">
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
          onFormSubmittedHandler={mutate}
        />
      </div>
    </motion.div>
  );
}
