import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'manga/:id',
    loadComponent: () => import('./views/manga/manga.page').then( m => m.MangaPage)
  },
  {
    path: 'chapter/:id',
    loadComponent: () => import('./views/chapter/chapter.page').then( m => m.ChapterPage)
  },
  {
    path: 'latest-updates',
    loadComponent: () => import('./views/latest-updates/latest-updates.page').then( m => m.LatestUpdatesPage)
  },
];
