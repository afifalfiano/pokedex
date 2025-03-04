import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import { API } from '../../common/internal-path';
import { IParams, IPokemonList, IResponse, PokemonDetail } from '../../common/models/pokemon';
import { IDetailTypePokemon } from 'src/app/common/models/types';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly httpClient = inject(HttpClient);
  constructor() { }

  getPokemonList(params: IParams): Observable<IResponse<IPokemonList[]>>{
    return this.httpClient.get<IResponse<IPokemonList[]>>(API.POKEMON, {params: {...params}}).pipe(
      retry(2),
      catchError(err => of(err))
    )
  }

  getPokemonDetail(pokemonName: string): Observable<PokemonDetail> {
    return this.httpClient.get<PokemonDetail>(`${API.POKEMON}/${pokemonName}`).pipe(
      retry(2),
      catchError(err => of(err))
    )
  }

  getTypeOfPokemon(): Observable<IResponse<IPokemonList[]>> {
    const params: IParams = {
      limit: 50,
      offset: 0
    }
    return this.httpClient.get<IResponse<IPokemonList[]>>(API.TYPES, {params: {...params}}).pipe(
      retry(2),
      catchError(err => of(err))
    )
  }

  getDetailTypeOfPokemon(url: string): Observable<IDetailTypePokemon>{
    return this.httpClient.get<IDetailTypePokemon>(url).pipe(
      retry(2),
      catchError(err => of(err))
    )
  }
}
