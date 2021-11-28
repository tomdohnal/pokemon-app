import styled from "@emotion/styled";
import Button from "./Button";
import { useFavoritePokemons } from "./lib/favorite-pokemons";

const PokemonHeader = styled.div({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  marginTop: "1rem"
});

function PokemonDetail({
  name,
  description
}: {
  name: string;
  description: string;
}) {
  const { favoritePokemons, toggleFavoritePokemon } = useFavoritePokemons();

  return (
    <div>
      <PokemonHeader>
        <h1>{name}</h1>
        <Button
          data-test-id="button-favorite"
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            toggleFavoritePokemon(name);
          }}
        >{`${
          favoritePokemons.includes(name) ? "Remove from" : "Add to"
        } favorites`}</Button>
      </PokemonHeader>
      <p>{description}</p>
    </div>
  );
}

export default PokemonDetail;
