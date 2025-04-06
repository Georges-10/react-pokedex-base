export function translateStat(stat: string) {
  // Translate the name of the pokemon to french
  switch (stat) {
    case "height":
      return "Taille en cm";
    case "weight":
      return "Poids en kg";
    case "hp":
      return "HP";
    case "attack":
      return "Attaque";
    case "defense":
      return "Défense";
    case "special-attack":
      return "Attaque Spéciale";
    case "special-defense":
      return "Défense Spéciale";
    case "speed":
      return "Vitesse";
    default:
      return stat;
  }
}
