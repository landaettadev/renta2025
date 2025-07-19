import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, CommonModule],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <span class="logo">
        <span class="car-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="14" width="24" height="8" rx="4" fill="#fff" stroke="#1976d2" stroke-width="2"/>
            <circle cx="9" cy="24" r="3" fill="#1976d2"/>
            <circle cx="23" cy="24" r="3" fill="#1976d2"/>
            <rect x="8" y="10" width="16" height="6" rx="3" fill="#1976d2"/>
          </svg>
        </span>
        <span class="brand">RentaFácil</span>
      </span>
      <span class="spacer"></span>
      <a mat-button routerLink="/" routerLinkActive="active">Inicio</a>
      <ng-container *ngIf="!isLoggedIn">
        <a mat-button routerLink="/login" routerLinkActive="active">Iniciar sesión</a>
        <a mat-button routerLink="/register" routerLinkActive="active">Registrarse</a>
      </ng-container>
      <ng-container *ngIf="isLoggedIn">
        <a mat-button routerLink="/perfil" routerLinkActive="active">Perfil</a>
        <a mat-button routerLink="/reservas" routerLinkActive="active">Mis reservas</a>
        <a *ngIf="isAdmin" mat-button routerLink="/admin" routerLinkActive="active">Admin</a>
        <button mat-button (click)="logout()">Salir</button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .navbar { position: sticky; top: 0; z-index: 100; }
    .logo { display: flex; align-items: center; font-size: 1.5rem; font-weight: 700; letter-spacing: 1px; }
    .car-icon { margin-right: 8px; display: flex; align-items: center; }
    .brand { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 1.6rem; color: #fff; }
    .spacer { flex: 1 1 auto; }
    a[mat-button] { color: #fff; font-weight: 600; font-family: 'Montserrat', sans-serif; }
    a.active { border-bottom: 2px solid #fff; }
    @media (max-width: 600px) {
      .brand { font-size: 1.1rem; }
      .logo { font-size: 1.1rem; }
      mat-toolbar { flex-wrap: wrap; }
    }
  `]
})
export class NavbarComponent {
  isLoggedIn = false;
  isAdmin = false;
  constructor(public auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.rol === 'Admin';
    });
  }
  logout() {
    this.auth.logout();
  }
} 