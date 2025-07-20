import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  template: `
    <mat-card class="login-card">
      <mat-card-title>Iniciar sesión</mat-card-title>
      <form [formGroup]="form" (ngSubmit)="login()" autocomplete="off" novalidate>
        <mat-form-field appearance="outline" class="full-width" [color]="isActive('email') ? 'primary' : undefined">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="Ej: correo@ejemplo.com" (focus)="setActive('email')" (blur)="setActive('')" />
          <mat-icon matPrefix>mail</mat-icon>
          <mat-hint *ngIf="form.controls['email'].valid && form.controls['email'].touched">¡Email válido!</mat-hint>
          <mat-error *ngIf="form.controls['email'].hasError('required') && form.controls['email'].touched">El email es obligatorio.</mat-error>
          <mat-error *ngIf="form.controls['email'].hasError('email') && form.controls['email'].touched">Formato de email inválido.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width" [color]="isActive('password') ? 'primary' : undefined">
          <mat-label>Contraseña</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Tu contraseña" (focus)="setActive('password')" (blur)="setActive('')" />
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword" [attr.aria-label]="hidePassword ? 'Mostrar contraseña' : 'Ocultar contraseña'" tabindex="0">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-hint *ngIf="form.controls['password'].valid && form.controls['password'].touched">¡Contraseña válida!</mat-hint>
          <mat-error *ngIf="form.controls['password'].hasError('required') && form.controls['password'].touched">La contraseña es obligatoria.</mat-error>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="loading || !form.valid" style="margin-top: 24px; width: 100%;">Entrar</button>
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
      background: #fff;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    }
    mat-card-title { font-family: 'Montserrat', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    .full-width { width: 100%; margin-bottom: 12px; }
    button[mat-raised-button] { margin-top: 24px; font-weight: 600; }
    input:focus { outline: 2px solid #1976d2; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  hidePassword = true;
  activeField = '';
  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  setActive(field: string) { this.activeField = field; }
  isActive(field: string) { return this.activeField === field; }
  login() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        this.auth.setToken(res.token, res.usuario?.datosPersonales, res.usuario?.clientId, res.usuario?.id);
        const role = this.auth.getRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/perfil']);
        }
      },
      error: (err: any) => {
        this.error = err.error || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
} 