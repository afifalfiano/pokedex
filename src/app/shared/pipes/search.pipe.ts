import { Pipe, PipeTransform } from '@angular/core';
import { IPokemonList } from 'src/app/common/models/pokemon';

@Pipe({
  name: 'filterSearch',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(items: IPokemonList[], searchText: string, field: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return item[field].toLowerCase().includes(searchText);
    });
  }
}

