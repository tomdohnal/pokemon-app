export const fetchPokemon = ({
  name,
  signal
}: {
  name: string;
  signal?: AbortSignal;
}) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`, {
    signal
  });
};

export const getDescriptionFromPokemonResponse = (response: Response) => {
  return response.json().then(
    (res: {
      flavor_text_entries: {
        flavor_text: string;
        language: { name: string };
      }[];
    }) => {
      const englishEntries = res.flavor_text_entries
        .filter(
          (entry: { language: { name: string } }) =>
            entry.language.name === "en"
        )
        .map(entry => entry.flavor_text);

      const dedupedEntires = Array.from(new Set(englishEntries));

      return dedupedEntires.join("");
    }
  );
};

export const fetchShakespearean = ({
  text,
  signal
}: {
  text: string;
  signal?: AbortSignal;
}) => {
  return fetch("https://api.funtranslations.com/translate/shakespeare.json", {
    method: "POST",
    body: new URLSearchParams({ text }),
    signal: signal
  });
};

export const getTextFromShakespeareanResponse = (response: Response) => {
  return response
    .json()
    .then(
      (res: { contents: { translated: string } }) => res.contents.translated
    );
};
