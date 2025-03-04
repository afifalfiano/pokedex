import { Injectable, signal } from '@angular/core';
import { IPokemonList } from '../../common/models/pokemon';
import { removeDuplicate } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly data = signal<any[]>([]);
  constructor() { }

  set(payload: any[]) {
    this.data.set(payload);
  }

  update(payload: any) {
    this.data.update(prev => removeDuplicate([...prev, payload], 'name'));
  }

  get() {
    return this.data;
  }

  find(payload: string) {
    return this.data().find((item: IPokemonList) => item?.name === payload);
  }

  delete(payload: IPokemonList) {
    return this.data.update(prev => {
     return prev.filter((item: IPokemonList) => item?.name !== payload.name);
    })
  }
}
