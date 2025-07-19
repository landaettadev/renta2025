import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card class="profile-card">
      <mat-card-title>Mi Perfil</mat-card-title>
      <form (ngSubmit)="save()" #form="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput name="nombre" [(ngModel)]="nombre" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput name="email" [(ngModel)]="email" required disabled />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">Guardar</button>
      </form>
      <div *ngIf="success" class="success">¡Perfil actualizado (simulado)!</div>
    </mat-card>
  `,
  styles: [`
    .profile-card {
      max-width: 400px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
    }
    mat-card-title { font-family: 'Montserrat', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    button { margin-top: 16px; }
  `]
})
export class ProfileComponent {
  nombre = '';
  email = '';
  success = false;
  constructor(private auth: AuthService) {
    const user = this.auth.getUserFromToken();
    this.nombre = user?.nombre || '';
    this.email = user?.email || '';
  }
  save() {
    this.success = true;
    setTimeout(() => this.success = false, 2000);
  }
} 