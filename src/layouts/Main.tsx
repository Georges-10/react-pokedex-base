import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Logo from "../components/Logo/Logo";
import Nav from "../components/Nav/Nav";

export default function Main() {
  const navigation = useNavigation();
  return (
    <>
      <Logo />
      <Nav />
      {navigation.state === "loading" && (
        <div className="text-center mt-1">Chargement...</div>
      )}

      <Outlet />
      <Footer />
    </>
  );
}
