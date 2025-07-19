import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', loadComponent: () => import('./features/vehicles/vehicle-search.component').then(m => m.VehicleSearchComponent) },
  { path: 'bookings/create', loadComponent: () => import('./features/bookings/booking-create.component').then(m => m.BookingCreateComponent) },
  { path: 'bookings/history', loadComponent: () => import('./features/bookings/booking-history.component').then(m => m.BookingHistoryComponent) },
];
