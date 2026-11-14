import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'orders', 
    pathMatch: 'full' 
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/order-list/order-list.component')
      .then(m => m.OrderListComponent)
  },
  {
    path: 'orders/create',
    loadComponent: () => import('./features/order-create/order-create.component')
      .then(m => m.OrderCreateComponent)
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/order-detail/order-detail.component')
      .then(m => m.OrderDetailComponent)
  },
  { 
    path: '**', 
    redirectTo: 'orders' 
  }
];
