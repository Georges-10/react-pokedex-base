import { UseMutateFunction } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  FormEvent,
  HTMLAttributes,
  RefObject,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { Pokemon } from "../../types/pokemon";
import { PokemonTypeCheckbox } from "./checkBoxForm";
import { LabeledInput } from "./labelInput";
import { PokemonType } from "./poketype";
import { PokemonStatsGroup } from "./statePokemonGroup";
export type PokemonRefs = {
  nameRef: RefObject<HTMLInputElement>;
  heightRef: RefObject<HTMLInputElement>;
  weightRef: RefObject<HTMLInputElement>;
  hpRef: RefObject<HTMLInputElement>;
  attackRef: RefObject<HTMLInputElement>;
  defenseRef: RefObject<HTMLInputElement>;
  specialAttackRef: RefObject<HTMLInputElement>;
  specialDefenseRef: RefObject<HTMLInputElement>;
  speedRef: RefObject<HTMLInputElement>;
  imageRef: RefObject<HTMLInputElement>;
  typesRef: RefObject<Record<string, HTMLInputElement>>;
  onFormSubmittedHandler:
    | UseMutateFunction<void, Error, void, unknown>
    | (() => Promise<void>);
  pokemon?: Pokemon;
} & HTMLAttributes<HTMLDivElement>;

function setRefValue(
  ref: React.RefObject<HTMLInputElement>,
  value: string | number,
) {
  if (ref.current) {
    ref.current.value = String(value);
  }
}

export default function MakeForm({
  onFormSubmittedHandler,
  nameRef,
  heightRef,
  weightRef,
  hpRef,
  attackRef,
  defenseRef,
  specialAttackRef,
  specialDefenseRef,
  speedRef,
  imageRef,
  typesRef,
  pokemon,
  ...props
}: PokemonRefs) {
  // If pokemon is not empty, fill the form with pokemon data
  useEffect(() => {
    if (pokemon) {
      setRefValue(nameRef, pokemon.name);
      setRefValue(heightRef, pokemon.height * 10);
      setRefValue(weightRef, pokemon.weight / 10);
      setRefValue(hpRef, pokemon.states.hp);
      setRefValue(attackRef, pokemon.states.attack);
      setRefValue(defenseRef, pokemon.states.defense);
      setRefValue(specialAttackRef, pokemon.states.specialAttack);
      setRefValue(specialDefenseRef, pokemon.states.specialDefense);
      setRefValue(speedRef, pokemon.states.speed);
      setRefValue(imageRef, pokemon.image);
      pokemon.types.forEach((type) => {
        typesRef.current![type].checked = true;
      });
    }
  }, [pokemon]);

  // Function
  const onBeforeSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    let isValid = true;
    // Check if name, height, weight and image are not empty
    if (
      !nameRef.current?.value ||
      !heightRef.current?.value ||
      !weightRef.current?.value ||
      !imageRef.current?.value
    ) {
      isValid = false;
    }

    // If there is no types checked, isValid is false
    let typeChecked = false;
    if (typesRef.current) {
      const typesKeys = Object.keys(typesRef.current);
      typesKeys.forEach((type) => {
        if (typesRef.current![type].checked) {
          typeChecked = true;
        }
      });
    }
    if (!typeChecked) {
      isValid = false;
    }

    if (isValid) {
      onFormSubmittedHandler();
    } else {
      toast.error("Merci de remplir le formulaire");
    }
  };

  return (
    <form onSubmit={(e) => onBeforeSubmitHandler(e)}>
      <LabeledInput
        id="name"
        label="Nom"
        refObj={nameRef}
      ></LabeledInput>
      <div className="mb-5">
        <label htmlFor="type">Type(s) </label>
        <div className="flex flex-wrap">
          {
            /* Display all pokemon types checkboxs */
            Object.values(PokemonType).map((type, index) => (
              <PokemonTypeCheckbox
                key={index}
                type={type}
                typesRef={typesRef}
              />
            ))
          }
        </div>
      </div>

      <PokemonStatsGroup
        statRefs={{
          height: heightRef,
          weight: weightRef,
          hp: hpRef,
          attack: attackRef,
          defense: defenseRef,
          specialAttack: specialAttackRef,
          specialDefense: specialDefenseRef,
          speed: speedRef,
        }}
      />
      <LabeledInput
        id="image"
        label="Image"
        refObj={imageRef}
        placeholder="https://..."
      ></LabeledInput>

      {/* <div className="mb-5">
        <label htmlFor="image">Image</label>
        <input
          type="text"
          name="image"
          id="image"
          placeholder="https://..."
          ref={imageRef}
          className="border border-gray-400 rounded-md px-3 py-2 w-full text-black"
        />
      </div> */}
      <div className="flex justify-center">
        <motion.button
          type="submit"
          className="bg-yellow-500 text-white px-10 py-3 rounded-md hover:bg-yellow-600 duration-150"
          onClick={(e) => onBeforeSubmitHandler(e)}
          whileHover={{
            scale: 1.5,
          }}
          whileInView={{
            scale: 1.1,
          }}
        >
          {pokemon ? "Evoluer le pokémon" : "Faire naître un pokémon"}
        </motion.button>
      </div>
    </form>
  );
}
