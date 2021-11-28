import isPropValid from "@emotion/is-prop-valid";
import styled from "@emotion/styled";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useFavoritePokemons } from "./lib/favorite-pokemons";

const Nav = styled.nav({
  maxWidth: "992px",
  margin: "0 auto",
  padding: "1rem"
});

const NavLink = styled(Link, {
  shouldForwardProp: isPropValid
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  color: isActive ? theme.primaryColor : theme.textLightColor,
  display: "inline-block",
  fontSize: "1.5rem",
  fontWeight: 700,
  textDecoration: "none",
  marginBottom: "1rem",
  paddingBottom: ".25rem",
  borderBottom: "4px solid",
  borderColor: isActive ? theme.primaryColor : "transparent",
  "&:not(:first-of-type)": {
    marginLeft: "1rem"
  }
}));

function App() {
  const { favoritePokemons } = useFavoritePokemons();
  const { pathname } = useLocation();

  return (
    <Nav>
      <NavLink data-test-id="nav-link-home" isActive={pathname === "/"} to="/">
        Home
      </NavLink>
      <NavLink
        data-test-id="nav-link-favorites"
        isActive={pathname === "/favorites"}
        to="/favorites"
      >
        Favorites ({favoritePokemons.length})
      </NavLink>
      <Outlet />
    </Nav>
  );
}

export default App;
