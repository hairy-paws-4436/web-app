import { Routes } from '@angular/router';
import {isNotAuthenticatedGuard} from './auth/guards/is-not-authenticated.guard';
import {isAuthenticatedGuard} from './auth/guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/routing/auth.routes').then(m => m.AuthRoutingModule),
  },
  {
    path: 'hairy-paws',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () =>import('./hairy-paws/routing/hairy-paws.routes').then(m => m.HairyPawsRoutingModule),
  },
  {
    path: '**',
    redirectTo: 'auth'
  },
];
