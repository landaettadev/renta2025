import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register.component').then(m => m.RegisterComponent) },
  { path: 'perfil', loadComponent: () => import('./profile.component').then(m => m.ProfileComponent), canActivate: ['authGuard'] },
  { path: 'reservas', loadComponent: () => import('./booking-history.component').then(m => m.BookingHistoryComponent), canActivate: ['authGuard'] },
  { path: 'admin', loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: ['adminGuard'] },
  { path: 'admin/vehiculos', loadComponent: () => import('./admin-vehicles.component').then(m => m.AdminVehiclesComponent), canActivate: ['adminGuard'] },
  { path: 'admin/reservas', loadComponent: () => import('./admin-bookings.component').then(m => m.AdminBookingsComponent), canActivate: ['adminGuard'] },
  { path: 'admin/usuarios', loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent), canActivate: ['adminGuard'] },
  { path: '**', redirectTo: '' }
];
