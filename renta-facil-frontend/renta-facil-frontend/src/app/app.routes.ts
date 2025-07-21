import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register.component').then(m => m.RegisterComponent) },
  { path: 'perfil', loadComponent: () => import('./profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'reservas', loadComponent: () => import('./booking-history.component').then(m => m.BookingHistoryComponent), canActivate: [authGuard] },
  { path: 'reservar/:id', loadComponent: () => import('./booking-create.component').then(m => m.BookingCreateComponent), canActivate: [authGuard] },
  {
    path: 'admin',
    loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'vehiculos', pathMatch: 'full' },
      { path: 'vehiculos', loadComponent: () => import('./admin-vehicles.component').then(m => m.AdminVehiclesComponent) },
      { path: 'reservas', loadComponent: () => import('./admin-bookings.component').then(m => m.AdminBookingsComponent) },
      { path: 'usuarios', loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent) },
      // Puedes agregar más rutas hijas aquí
    ]
  },
  { path: '**', redirectTo: '' }
];
