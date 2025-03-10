export const removeDuplicate = (arr: any[], key: string): any[] => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export const getPokemonId = (url: string) => {
  const parts = url.split("/"); // https://pokeapi.co/api/v2/pokemon/16/
  const id = parts[parts.length - 2];
  return id;
}