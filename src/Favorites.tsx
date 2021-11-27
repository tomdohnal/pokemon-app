import { useFavoritePokemons } from './lib/favorite-pokemons';
import Ul from './Ul';
import Link from './Link';

function Favorites() {
  const { favoritePokemons } = useFavoritePokemons();

  if (!favoritePokemons.length) {
    return null;
  }

  return (
    <Ul>
      {favoritePokemons.map((pokemon) => (
        <li key={pokemon}>
          <Link to={`/?pokemonName=${pokemon.toLocaleLowerCase()}`}>
            {pokemon}
          </Link>
        </li>
      ))}
    </Ul>
  );
}

export default Favorites;
