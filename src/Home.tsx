import styled from '@emotion/styled';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from './Button';
import {
  ErrorDrawing,
  NotFoundDrawing,
  PulsingSearchDrawing,
  SearchDrawing,
} from './drawings';
import Input from './Input';
import InputGroup from './InputGroup';
import breakpoints from './lib/breakpoints';
import { useFavoritePokemons } from './lib/favorite-pokemons';
import { usePrevious } from './lib/hooks';
import PlaceHolder from './PlaceHolder';

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

const PokemonHeader = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  marginTop: '1rem',
});

const Form = styled.form({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1rem',
  '& input': {
    marginBottom: '.75rem',
  },
  [breakpoints.md]: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    '& input': {
      marginBottom: 0,
      marginRight: '1rem',
    },
  },
});

function Home() {
  const [pokemonName, setPokemonName] = useState('');
  const [appState, setAppState] = useState<AppState>({ state: 'idle' });
  const { favoritePokemons, toggleFavoritePokemon } = useFavoritePokemons();
  const [searchParams, setSearchParams] = useSearchParams();
  const prevSearchParams = usePrevious(searchParams);

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
      } finally {
        setPokemonName('');
      }
    };

    const pokemonName = searchParams.get('pokemonName');
    const prevPokemonName = prevSearchParams?.get('pokemonName');

    if (pokemonName && pokemonName !== prevPokemonName) {
      fetchPokemonDescription(pokemonName);
    }

    return () => {
      if (pokemonName === prevPokemonName) {
        abortController.abort();
      }
    };
  }, [pokemonName, prevSearchParams, searchParams]);

  return (
    <div>
      <Form onSubmit={onFormSubmit}>
        <InputGroup>
          <label htmlFor="pokemon-name">Pokemon Name</label>
          <Input
            id="pokemon-name"
            value={pokemonName}
            onChange={onInputChange}
          ></Input>
        </InputGroup>
        <Button type="submit">Search</Button>
      </Form>
      {appState.state === 'idle' && (
        <PlaceHolder
          drawing={<SearchDrawing />}
          text="Search a pokemon to get started"
        />
      )}
      {appState.state === 'loading' && (
        <PlaceHolder drawing={<PulsingSearchDrawing />} text="Searching..." />
      )}
      {appState.state === 'error' && (
        <PlaceHolder
          drawing={<ErrorDrawing />}
          text="There's been an error searching for your pokemon..."
        />
      )}
      {appState.state === 'notFound' && (
        <PlaceHolder
          drawing={<NotFoundDrawing />}
          text="Couldn't find your pokemon..."
        />
      )}
      {appState.state === 'found' && (
        <div>
          <PokemonHeader>
            <h1>{appState.payload.name}</h1>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                toggleFavoritePokemon(appState.payload.name);
              }}
            >{`${
              favoritePokemons.includes(appState.payload.name)
                ? 'Remove from'
                : 'Add to'
            } favorites`}</Button>
          </PokemonHeader>
          <p>{appState.payload.description}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
