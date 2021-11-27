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
import {
  fetchPokemon,
  fetchShakespearean,
  getDescriptionFromPokemonResponse,
  getTextFromShakespeareanResponse,
} from './lib/api';
import breakpoints from './lib/breakpoints';
import { usePrevious } from './lib/hooks';
import PlaceHolder from './PlaceHolder';
import PokemonDetail from './PokemonDetail';

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
  const [pokemonName, setPokemonName] = useState('');
  const [appState, setAppState] = useState<AppState>({ state: 'idle' });
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
        const pokemonResponse = await fetchPokemon({
          name: pokemonName,
          signal: abortController.signal,
        });

        if (pokemonResponse.status === 404) {
          setAppState({ state: 'notFound' });
          return;
        }

        if (!pokemonResponse.ok) {
          throw pokemonResponse;
        }

        const description = await getDescriptionFromPokemonResponse(
          pokemonResponse
        );

        const shakespeareanResponse = await fetchShakespearean({
          text: description,
          signal: abortController.signal,
        });

        if (!shakespeareanResponse.ok) {
          throw shakespeareanResponse;
        }

        const translatedText = await getTextFromShakespeareanResponse(
          shakespeareanResponse
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
        <PokemonDetail
          name={appState.payload.name}
          description={appState.payload.description}
        />
      )}
    </div>
  );
}

export default Home;
