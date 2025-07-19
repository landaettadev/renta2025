import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="admin-dashboard-card">
      <mat-card-title>Panel de Administración</mat-card-title>
      <div class="admin-actions">
        <a mat-raised-button color="primary" routerLink="/admin/vehiculos">Gestión de Vehículos</a>
        <a mat-raised-button color="accent" routerLink="/admin/reservas">Gestión de Reservas</a>
        <a mat-raised-button color="warn" routerLink="/admin/usuarios">Gestión de Usuarios</a>
      </div>
    </mat-card>
  `,
  styles: [`
    .admin-dashboard-card {
      max-width: 500px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
      text-align: center;
    }
    .admin-actions {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 32px;
    }
    a[mat-raised-button] {
      font-size: 1.1rem;
      font-family: 'Montserrat', sans-serif;
    }
  `]
})
export class AdminDashboardComponent {} 