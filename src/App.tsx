import { Outlet, Link } from 'react-router-dom';
import { useFavoritePokemons } from './lib/favorite-pokemons';

function App() {
  const { favoritePokemons } = useFavoritePokemons();

  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/favorites">Favorites ({favoritePokemons.length})</Link>
      <Outlet />
    </div>
  );
}

export default App;
