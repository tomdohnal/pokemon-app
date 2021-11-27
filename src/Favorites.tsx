import { useFavoritePokemons } from './lib/favorite-pokemons';
import Ul from './Ul';
import Link from './Link';
import styled from '@emotion/styled';
import PlaceHolder from './PlaceHolder';
import { VoidDrawing } from './drawings';

const Heading = styled.h1({
  marginTop: 0,
  marginBottom: '1rem',
  fontSize: '2rem',
});

function Favorites() {
  const { favoritePokemons } = useFavoritePokemons();

  if (!favoritePokemons.length) {
    return (
      <PlaceHolder
        drawing={<VoidDrawing />}
        text="You haven't favorited any pokemons yet"
      />
    );
  }

  return (
    <div>
      <Heading>Favorited pokemons</Heading>
      <Ul>
        {favoritePokemons.map((pokemon) => (
          <li key={pokemon}>
            <Link to={`/?pokemonName=${pokemon.toLocaleLowerCase()}`}>
              {pokemon}
            </Link>
          </li>
        ))}
      </Ul>
    </div>
  );
}

export default Favorites;
