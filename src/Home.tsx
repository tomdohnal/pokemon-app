import { ChangeEvent, FormEvent, useState } from 'react';

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
      payload: string;
    }
  | {
      state: 'error';
    };

function Home() {
  const [pokemonName, setPokemonName] = useState('Wormadam'); // TODO: set to empty string
  const [appState, setAppState] = useState<AppState>({ state: 'idle' });

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPokemonName(event.target.value);
  };

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setAppState({ state: 'loading' });

    try {
      const pokemonResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`
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
        }
      );

      if (!shakespeareanResponse.ok) {
        throw shakespeareanResponse;
      }

      const translatedText = await shakespeareanResponse
        .json()
        .then((res) => res.contents.translated);

      setAppState({ state: 'found', payload: translatedText });
    } catch (err) {
      console.error(err);

      setAppState({ state: 'error' });
    }
  };

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
        {appState.state === 'found' && <div>{appState.payload}</div>}
      </form>
    </div>
  );
}

export default Home;
