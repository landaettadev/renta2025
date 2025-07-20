import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule, CommonModule, MatSlideToggleModule],
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header class="w-full flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-gray-900/80 shadow-sm">
        <div class="flex items-center gap-3">
          <mat-icon class="text-blue-600 dark:text-blue-400 text-2xl">admin_panel_settings</mat-icon>
          <span class="font-semibold text-blue-900 dark:text-blue-200 text-lg">Panel de Administración</span>
        </div>
        <div class="flex items-center gap-4">
          <mat-slide-toggle color="primary" [checked]="darkMode" (change)="toggleDarkMode()" class="dark-toggle" aria-label="Modo oscuro">
            <mat-icon class="mr-1">{{ darkMode ? 'dark_mode' : 'light_mode' }}</mat-icon>
          </mat-slide-toggle>
          <span class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
            <mat-icon class="text-green-500 text-base">cloud_done</mat-icon> <span>Conectado</span>
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ now | date:'mediumTime' }}</span>
          <span class="flex items-center gap-1 text-sm text-blue-800 dark:text-blue-200 font-semibold">
            <mat-icon class="text-base">person</mat-icon> {{ userName }}
          </span>
          <button mat-icon-button (click)="logout()" aria-label="Cerrar sesión">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </header>
      <main class="flex-1 flex items-center justify-center">
        <mat-card class="admin-dashboard-card shadow-xl rounded-2xl bg-white dark:bg-gray-900 transition-colors duration-300">
          <div class="flex items-center justify-center gap-2 mb-2">
            <mat-icon class="text-blue-600 dark:text-blue-400 text-3xl">dashboard</mat-icon>
            <span class="text-2xl font-bold text-blue-800 dark:text-blue-200">Panel principal</span>
          </div>
          <div class="text-gray-500 dark:text-gray-300 mb-6 text-base font-semibold tracking-wide text-center" style="font-size:1.13rem;">Gestiona los recursos principales del sistema</div>
          <div class="admin-actions flex flex-col items-stretch w-full mt-6 gap-4">
            <a mat-raised-button color="primary" class="btn block w-full flex items-center gap-4 justify-start py-4 px-6 text-base font-semibold shadow-none rounded-lg border-0 border-b border-b-gray-200 dark:border-b-gray-700 transition hover:bg-blue-50 dark:hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-blue-400" routerLink="/admin/vehiculos">
              <mat-icon class="text-xl">directions_car</mat-icon> Gestión de Vehículos
            </a>
            <a mat-raised-button color="accent" class="btn block w-full flex items-center gap-4 justify-start py-4 px-6 text-base font-semibold shadow-none rounded-lg border-0 border-b border-b-gray-200 dark:border-b-gray-700 transition hover:bg-blue-50 dark:hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-blue-400" routerLink="/admin/reservas">
              <mat-icon class="text-xl">event_note</mat-icon> Gestión de Reservas
            </a>
            <a mat-raised-button color="warn" class="btn block w-full flex items-center gap-4 justify-start py-4 px-6 text-base font-semibold shadow-none rounded-lg border-0 border-b border-b-gray-200 dark:border-b-gray-700 transition hover:bg-red-50 dark:hover:bg-red-900 focus-visible:ring-2 focus-visible:ring-red-400" routerLink="/admin/usuarios">
              <mat-icon class="text-xl">group</mat-icon> Gestión de Usuarios
            </a>
            <a mat-raised-button color="default" class="btn block w-full flex items-center gap-4 justify-start py-4 px-6 text-base font-semibold shadow-none rounded-lg border-0 transition hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-400" routerLink="/admin/reportes">
              <mat-icon class="text-xl">bar_chart</mat-icon> Ver Reportes
            </a>
          </div>
        </mat-card>
      </main>
    </div>
  `,
  styles: [`
    .btn:hover, .btn:focus-visible {
      transform: scale(1.03);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .admin-dashboard-card {
      width: 100%;
      max-width: 480px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 18px;
      text-align: center;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .dark-toggle { margin-right: 8px; }
    @media (max-width: 600px) {
      .admin-dashboard-card { padding: 12px 4px; }
      .admin-actions { max-width: 100%; }
    }
  `]
})
export class AdminDashboardComponent {
  now = new Date();
  userName = '';
  interval: any;
  darkMode = false;
  constructor(private auth: AuthService) {
    const user = this.auth.getUserFromToken();
    this.userName = user?.nombre || user?.email || 'Usuario';
    this.interval = setInterval(() => this.now = new Date(), 1000);
    // Preferencia de modo oscuro
    const saved = localStorage.getItem('rf_dark_mode');
    if (saved === 'true') {
      this.darkMode = true;
      document.documentElement.classList.add('dark');
    } else if (saved === 'false') {
      this.darkMode = false;
      document.documentElement.classList.remove('dark');
    } else {
      // Si no hay preferencia, usar la del sistema
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (this.darkMode) document.documentElement.classList.add('dark');
    }
  }
  logout() {
    this.auth.logout();
  }
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rf_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rf_dark_mode', 'false');
    }
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
} 