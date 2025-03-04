import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import { API } from '../common/internal-path';
import { IParams, IResponse } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly httpClient = inject(HttpClient);
  constructor() { }

  getPokemonList(params: IParams): Observable<IResponse>{
    return this.httpClient.get<IResponse>(API.POKEMON, {params: {...params}}).pipe(
      retry(2),
      catchError(err => of(err))
    )
  }
}
