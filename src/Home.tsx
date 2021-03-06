import styled from "@emotion/styled";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "./Button";
import {
  ErrorDrawing,
  NotFoundDrawing,
  PulsingSearchDrawing,
  SearchDrawing
} from "./drawings";
import Input from "./Input";
import InputGroup from "./InputGroup";
import {
  fetchPokemon,
  fetchShakespearean,
  getDescriptionFromPokemonResponse,
  getTextFromShakespeareanResponse
} from "./lib/api";
import breakpoints from "./lib/breakpoints";
import PlaceHolder from "./PlaceHolder";
import PokemonDetail from "./PokemonDetail";

const Form = styled.form({
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
  "& input": {
    marginBottom: ".75rem"
  },
  [breakpoints.md]: {
    flexDirection: "row",
    alignItems: "flex-end",
    "& input": {
      marginBottom: 0,
      marginRight: "1rem"
    }
  }
});

type AppState =
  | {
      state: "idle";
    }
  | {
      state: "loading";
    }
  | {
      state: "notFound";
    }
  | {
      state: "found";
      payload: {
        name: string;
        description: string;
      };
    }
  | {
      state: "error";
    };

function Home() {
  const [pokemonName, setPokemonName] = useState("");
  const [appState, setAppState] = useState<AppState>({ state: "idle" });
  const [searchParams] = useSearchParams();
  const abortControllerRef = useRef(new AbortController());

  const fetchPokemonDescription = async ({
    pokemonName
  }: {
    pokemonName: string;
  }) => {
    setAppState({ state: "loading" });

    try {
      const pokemonResponse = await fetchPokemon({
        name: pokemonName,
        signal: abortControllerRef.current.signal
      });

      if (pokemonResponse.status === 404) {
        setAppState({ state: "notFound" });
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
        signal: abortControllerRef.current.signal
      });

      if (!shakespeareanResponse.ok) {
        throw shakespeareanResponse;
      }

      const translatedText = await getTextFromShakespeareanResponse(
        shakespeareanResponse
      );

      setAppState({
        state: "found",
        payload: { description: translatedText, name: pokemonName }
      });
    } catch (err) {
      console.error(err);

      if (!abortControllerRef.current.signal.aborted) {
        setAppState({ state: "error" });
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setPokemonName("");
      }
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPokemonName(event.target.value);
  };

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetchPokemonDescription({
      pokemonName: pokemonName.toLocaleLowerCase()
    });
  };

  useEffect(() => {
    const pokemonName = searchParams.get("pokemonName");

    if (pokemonName) {
      fetchPokemonDescription({ pokemonName });
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      abortControllerRef.current.abort();
    };
  }, [searchParams]);

  return (
    <div>
      <Form onSubmit={onFormSubmit}>
        <InputGroup>
          <label htmlFor="pokemon-name">Pokemon Name</label>
          <Input
            data-test-id="input-search"
            id="pokemon-name"
            value={pokemonName}
            onChange={onInputChange}
          ></Input>
        </InputGroup>
        <Button data-test-id="button-submit" type="submit">
          Search
        </Button>
      </Form>
      {appState.state === "idle" && (
        <PlaceHolder
          drawing={<SearchDrawing />}
          text="Search a pokemon to get started"
        />
      )}
      {appState.state === "loading" && (
        <PlaceHolder drawing={<PulsingSearchDrawing />} text="Searching..." />
      )}
      {appState.state === "error" && (
        <PlaceHolder
          drawing={<ErrorDrawing />}
          text="There's been an error searching for your pokemon..."
        />
      )}
      {appState.state === "notFound" && (
        <PlaceHolder
          drawing={<NotFoundDrawing />}
          text="Couldn't find your pokemon..."
        />
      )}
      {appState.state === "found" && (
        <PokemonDetail
          name={appState.payload.name}
          description={appState.payload.description}
        />
      )}
    </div>
  );
}

export default Home;
