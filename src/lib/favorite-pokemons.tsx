import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const LOCAL_STORAGE_KEY = 'favoritePokemons';

const FavoritePokemonsContext = createContext<{
  favoritePokemons: string[];
  toggleFavoritePokemon: (name: string) => void;
} | null>(null);

export const FavoritePokemonContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [favoritePokemons, setFavoritePokemons] = useState<string[]>(() =>
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoritePokemons));
  }, [favoritePokemons]);

  const toggleFavoritePokemon = useCallback((name: string) => {
    setFavoritePokemons((prevPokemons) => {
      if (prevPokemons.includes(name)) {
        // remove the pokemon from favorites
        return prevPokemons.filter((prevPokemon) => prevPokemon !== name);
      }

      // add the pokemon to favorites
      return [...prevPokemons, name];
    });
  }, []);

  return (
    <FavoritePokemonsContext.Provider
      value={{ favoritePokemons, toggleFavoritePokemon }}
    >
      {children}
    </FavoritePokemonsContext.Provider>
  );
};

export const useFavoritePokemons = () => {
  const favoritePokemonsContext = useContext(FavoritePokemonsContext);

  if (favoritePokemonsContext === null) {
    throw new Error(
      '`useFavoritePokemons` must be used inside of `FavoritePokemonsContext.Provider`'
    );
  }

  return favoritePokemonsContext;
};
