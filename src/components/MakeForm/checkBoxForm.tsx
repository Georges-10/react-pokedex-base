import { translateType } from "../../utils/translateType";
import { PokemonType } from "./poketype";

// --- CHECKBOXES ---
interface PokemonTypeCheckboxProps {
  type: PokemonType;
  typesRef: React.RefObject<Record<string, HTMLInputElement>>;
}

export function PokemonTypeCheckbox({
  type,
  typesRef,
}: PokemonTypeCheckboxProps) {
  return (
    <label className="w-1/2 ">
      <input
        type="checkbox"
        name={type}
        id={type}
        value={type}
        ref={(el) => {
          if (el) typesRef.current![type] = el;
        }}
      />
      <label
        htmlFor={type}
        className="ml-3 capitalize"
      >
        {translateType(type)}
      </label>
    </label>
  );
}
