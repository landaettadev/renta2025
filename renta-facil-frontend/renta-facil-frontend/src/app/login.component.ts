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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card class="login-card">
      <mat-card-title>Iniciar sesión</mat-card-title>
      <form (ngSubmit)="login()" #form="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" name="email" [(ngModel)]="email" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" name="password" [(ngModel)]="password" required />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="loading || !form.valid">Entrar</button>
      </form>
      <div *ngIf="error" class="error">{{ error }}</div>
    </mat-card>
  `,
  styles: [`
    .login-card {
      max-width: 400px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
    }
    mat-card-title { font-family: 'Montserrat', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    button { margin-top: 16px; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  constructor(private auth: AuthService, private router: Router) {}
  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.loading = false;
        const role = this.auth.getRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Credenciales inválidas.';
      }
    });
  }
} 