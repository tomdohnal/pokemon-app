import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFavoritePokemons } from './lib/favorite-pokemons';

type AppState =
  | {
      state: 'idle';
    }
  | {
      state: 'loading';
    }
  | {
      state: 'notFound';
    }
  | {
      state: 'found';
      payload: {
        name: string;
        description: string;
      };
    }
  | {
      state: 'error';
    };

function Home() {
  const [pokemonName, setPokemonName] = useState('Wormadam'); // TODO: set to empty string
  const [appState, setAppState] = useState<AppState>({ state: 'idle' });
  const { favoritePokemons, toggleFavoritePokemon } = useFavoritePokemons();
  const [searchParams, setSearchParams] = useSearchParams();

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPokemonName(event.target.value);
  };

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearchParams({ pokemonName: pokemonName.toLocaleLowerCase() });
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchPokemonDescription = async (pokemonName: string) => {
      setAppState({ state: 'loading' });

      try {
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`,
          {
            signal: abortController.signal,
          }
        );

        if (abortController.signal.aborted) {
          return;
        }

        if (pokemonResponse.status === 404) {
          setAppState({ state: 'notFound' });
          return;
        }

        if (!pokemonResponse.ok) {
          throw pokemonResponse;
        }

        const description = await pokemonResponse.json().then(
          (res: {
            flavor_text_entries: {
              flavor_text: string;
              language: { name: string };
            }[];
          }) => {
            const englishEntries = res.flavor_text_entries
              .filter(
                (entry: { language: { name: string } }) =>
                  entry.language.name === 'en'
              )
              .map((entry) => entry.flavor_text);

            // TODO: custom dedup algorithm which would convert everything to lowercase
            // and remove newline chars
            const dedupedEntires = Array.from(new Set(englishEntries));

            return dedupedEntires.join('');
          }
        );

        const shakespeareanResponse = await fetch(
          'https://api.funtranslations.com/translate/shakespeare.json',
          {
            method: 'POST',
            body: new URLSearchParams({ text: description }),
            signal: abortController.signal,
          }
        );

        if (abortController.signal.aborted) {
          return;
        }

        // TODO: handle 429 error code
        if (!shakespeareanResponse.ok) {
          throw shakespeareanResponse;
        }

        const translatedText = await shakespeareanResponse
          .json()
          .then(
            (res: { contents: { translated: string } }) =>
              res.contents.translated
          );

        setAppState({
          state: 'found',
          payload: { description: translatedText, name: pokemonName },
        });
      } catch (err) {
        console.error(err);

        setAppState({ state: 'error' });
      }
    };

    const pokemonName = searchParams.get('pokemonName');

    if (pokemonName) {
      fetchPokemonDescription(pokemonName);
    }

    return () => {
      abortController.abort();
    };
  }, [pokemonName, searchParams]);

  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <label htmlFor="pokemon-name">Pokemon Name</label>
        <input
          id="pokemon-name"
          value={pokemonName}
          onChange={onInputChange}
        ></input>
        <button type="submit">Search</button>
        {appState.state === 'idle' && <div>Search pokemon</div>}
        {appState.state === 'loading' && <div>Loading...</div>}
        {appState.state === 'error' && <div>Error...</div>}
        {appState.state === 'notFound' && <div>Not found...</div>}
        {appState.state === 'found' && (
          <div>
            <h1>{appState.payload.name}</h1>
            <button
              type="button"
              onClick={() => {
                toggleFavoritePokemon(appState.payload.name);
              }}
            >{`${
              favoritePokemons.includes(appState.payload.name)
                ? 'Remove from'
                : 'Add to'
            } favorites`}</button>
            <p>{appState.payload.description}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default Home;
