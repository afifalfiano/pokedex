import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/list.page').then((m) => m.ListPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.page').then( m => m.ContactPage)
  },
  {
    path: 'favorite',
    loadComponent: () => import('./favorite/favorite.page').then( m => m.FavoritePage)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./detail/detail.page').then( m => m.DetailPage)
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.page').then( m => m.NotFoundPage)
  },
];
