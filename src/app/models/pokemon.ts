
export interface IParams {
  limit: number;
  offset: number;
}

export interface IPokemonList {
  name: string;
  url: string;
}

export interface IResponse {
  count: number;
  next: string | null; 
  previous: string | null;
  results: IPokemonList[]
}