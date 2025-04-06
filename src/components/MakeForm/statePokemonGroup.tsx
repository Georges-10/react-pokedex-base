import { RefObject } from "react";
import { translateStat } from "../../utils/translateStat";
import { LabeledInput } from "./labelInput";

interface PokemonStatsGroupProps {
  statRefs: Record<string, RefObject<HTMLInputElement>>;
}

export function PokemonStatsGroup({
  statRefs,
}: PokemonStatsGroupProps) {
  return (
    <>
      {Object.entries(statRefs).map(([state, ref]) => {
        const isText = state === "height" || state === "weight";
        return isText ? (
          <LabeledInput
            key={state}
            id={state}
            label={translateStat(state)}
            refObj={ref}
            placeholder={state === "height" ? "0.5" : "3"}
          />
        ) : (
          <LabeledInput
            key={state}
            id={state}
            label={translateStat(state)}
            type="range"
            min={0}
            max={200}
            refObj={ref}
          />
        );
      })}
    </>
  );
}
