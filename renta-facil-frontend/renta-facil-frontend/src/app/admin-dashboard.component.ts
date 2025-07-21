import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule, CommonModule, MatSidenavModule],
  template: `
    <div class="min-h-screen flex bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <mat-sidenav-container class="admin-sidenav-container">
        <mat-sidenav mode="side" opened class="admin-sidenav">
          <div class="sidenav-title">Panel de Administración</div>
          <nav class="sidenav-menu">
            <a mat-list-item routerLink="/admin/vehiculos" routerLinkActive="active"><mat-icon>directions_car</mat-icon> Gestión de Vehículos</a>
            <a mat-list-item routerLink="/admin/reservas" routerLinkActive="active"><mat-icon>event_note</mat-icon> Gestión de Reservas</a>
            <a mat-list-item routerLink="/admin/usuarios" routerLinkActive="active"><mat-icon>group</mat-icon> Gestión de Usuarios</a>
            <a mat-list-item routerLink="/admin/reportes" routerLinkActive="active"><mat-icon>bar_chart</mat-icon> Ver Reportes</a>
          </nav>
        </mat-sidenav>
        <mat-sidenav-content>
          <div class="admin-content-center">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .admin-sidenav-container { height: 100vh; }
    .admin-sidenav { width: 260px; background: #f5f7fa; padding-top: 32px; }
    .sidenav-title { font-size: 1.25rem; font-weight: 700; color: #1976d2; margin-bottom: 32px; text-align: center; }
    .sidenav-menu { display: flex; flex-direction: column; gap: 8px; }
    .sidenav-menu a { display: flex; align-items: center; gap: 12px; font-size: 1.08rem; font-weight: 600; color: #333; padding: 12px 18px; border-radius: 8px; text-decoration: none; transition: background 0.18s; }
    .sidenav-menu a.active, .sidenav-menu a:hover { background: #e3e9fc; color: #1976d2; }
    .admin-content-center { display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 32px 0 48px 0; }
    .admin-dashboard-card { width: 100%; max-width: 480px; margin: 0 auto; padding: 32px 24px; border-radius: 18px; text-align: center; background: #fff; display: flex; flex-direction: column; align-items: center; }
    @media (max-width: 900px) {
      .admin-sidenav { width: 100px; padding-top: 16px; }
      .sidenav-title { font-size: 1rem; margin-bottom: 16px; }
      .sidenav-menu a { font-size: 0.98rem; padding: 10px 8px; }
    }
    @media (max-width: 600px) {
      .admin-sidenav-container { flex-direction: column; }
      .admin-content-center { min-height: 60vh; padding: 16px 0; }
      .admin-dashboard-card { padding: 12px 4px; }
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