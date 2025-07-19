import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card class="register-card">
      <mat-card-title>Registro de usuario</mat-card-title>
      <form (ngSubmit)="register()" #form="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput name="nombre" [(ngModel)]="nombre" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" name="email" [(ngModel)]="email" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" name="password" [(ngModel)]="password" required />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="loading || !form.valid">Registrarse</button>
      </form>
      <div *ngIf="success" class="success">Registro exitoso. Ahora puedes iniciar sesión.</div>
      <div *ngIf="error" class="error">{{ error }}</div>
    </mat-card>
  `,
  styles: [`
    .register-card {
      max-width: 400px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
    }
    mat-card-title { font-family: 'Montserrat', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    button { margin-top: 16px; }
  `]
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  loading = false;
  error = '';
  success = false;
  constructor(private auth: AuthService, private router: Router) {}
  register() {
    this.loading = true;
    this.error = '';
    this.success = false;
    this.auth.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Error al registrar usuario.';
      }
    });
  }
} 