import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/list/list.page').then((m) => m.ListPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./home/detail/detail.page').then( m => m.DetailPage),
      },
    ]
  },
  {
    path: 'favorite',
    loadComponent: () => import('./favorite/favorite.page').then( m => m.FavoritePage)
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.page').then( m => m.NotFoundPage)
  },
];
