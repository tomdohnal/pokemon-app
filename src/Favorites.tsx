import { Link } from 'react-router-dom';
import { useFavoritePokemons } from './lib/favorite-pokemons';

function Favorites() {
  const { favoritePokemons } = useFavoritePokemons();

  return (
    <div>
      <h1>Favorite Pokemons</h1>
      {!!favoritePokemons.length && (
        <ul>
          {favoritePokemons.map((pokemon) => (
            <li key={pokemon}>
              <Link to={`/?pokemonName=${pokemon.toLocaleLowerCase()}`}>
                {pokemon}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
