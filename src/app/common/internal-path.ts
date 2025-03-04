import { environment } from "src/environments/environment.prod";

export class API {
  static readonly POKEMON = environment.pokemonUrl + 'pokemon';
}