import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useFavoritePokemons } from './lib/favorite-pokemons';

const Container = styled.div({
  maxWidth: '992px',
  margin: '0 auto',
  padding: '1rem',
});

const NavLink = styled(Link, {
  shouldForwardProp: isPropValid,
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  color: isActive ? theme.primaryColor : theme.textLightColor,
  display: 'inline-block',
  fontSize: '1.5rem',
  fontWeight: 700,
  textDecoration: 'none',
  marginBottom: '1rem',
  paddingBottom: '.25rem',
  borderBottom: '4px solid',
  borderColor: isActive ? theme.primaryColor : 'transparent',
  '&:not(:first-of-type)': {
    marginLeft: '1rem',
  },
}));

function App() {
  const { favoritePokemons } = useFavoritePokemons();
  const { pathname } = useLocation();

  return (
    <Container>
      <NavLink isActive={pathname === '/'} to="/">
        Home
      </NavLink>
      <NavLink isActive={pathname === '/favorites'} to="/favorites">
        Favorites ({favoritePokemons.length})
      </NavLink>
      <Outlet />
    </Container>
  );
}

export default App;
