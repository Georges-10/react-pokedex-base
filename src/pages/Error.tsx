import { NavLink } from "react-router-dom";

export default function Error() {
  return (
    <div className="flex flex-col gap-5 h-screen justify-center items-center">
      <img
        src="/error.png"
        alt="error"
        className="w-[1000px]"
      />
      <p className="text-3xl">
        <span className="text-yellow-pokemon">Oups ! </span>Il
        semblerait qu'un <b>Ronflex</b> ait bloqué le chemin...
      </p>
      <NavLink
        to="/"
        className="inline-block mx-auto bg-yellow-pokemon hover:bg-yellow-100 duration-150 uppercase px-10 py-4 text-black font-semibold text-xl rounded-full mt-5"
      >
        Retourner à l'accueil
      </NavLink>
    </div>
  );
}
