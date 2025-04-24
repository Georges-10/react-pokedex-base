import {
  QueryClientProvider,
} from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  RouterProvider,
} from "react-router-dom";
import { queryClient } from "./clients/queryClient";
import Main from "./layouts/Main";
import Error from "./pages/Error";
import { getPokemonById } from "./utils/pokemonStore";

const Home = lazy(() => import("./pages/Home"));
const CreatePokemon = lazy(() => import("./pages/CreatePokemon"));
const PokemonDetails = lazy(() => import("./pages/PokemonDetails"));
const About = lazy(() => import("./pages/About"));

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    Component: Main,
    children: [
      {
        index: true,
        element: (
          <Suspense>
            <Home />
          </Suspense>
        ),
        /*  loader: () =>
          import("./pages/Home").then((module) => module.loader()), */
      },
      {
        path: "/about",
        element: (
          <Suspense>
            <About />
          </Suspense>
        ),
      },
      {
        path: "/create-pokemon",
        element: (
          <Suspense>
            <CreatePokemon />
          </Suspense>
        ),
      },
      {
        path: "/pokemon/:id",
        //tu peux aussi recupérer request
        loader: ({ params }: LoaderFunctionArgs) => {
          return getPokemonById(params.id!);
        },
        element: (
          <Suspense>
            <PokemonDetails />
          </Suspense>
        ),
      },
    ],
  },
]);
export default function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}
