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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  template: `
    <mat-card class="register-card">
      <mat-card-title>Registro de usuario</mat-card-title>
      <form [formGroup]="form" (ngSubmit)="register()" autocomplete="off" novalidate>
        <mat-form-field appearance="outline" class="full-width" [color]="isActive('nombre') ? 'primary' : undefined">
          <mat-label>Nombre completo</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Juan Pérez" (focus)="setActive('nombre')" (blur)="setActive('')" />
          <mat-icon matPrefix>person</mat-icon>
          <mat-hint *ngIf="form.controls['nombre'].valid && form.controls['nombre'].touched">¡Nombre válido!</mat-hint>
          <mat-error *ngIf="form.controls['nombre'].hasError('required') && form.controls['nombre'].touched">El nombre es obligatorio.</mat-error>
          <mat-error *ngIf="form.controls['nombre'].hasError('minlength') && form.controls['nombre'].touched">Mínimo 3 caracteres.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width" [color]="isActive('email') ? 'primary' : undefined">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="Ej: correo@ejemplo.com" (focus)="setActive('email')" (blur)="setActive('')" />
          <mat-icon matPrefix>mail</mat-icon>
          <mat-hint *ngIf="form.controls['email'].valid && form.controls['email'].touched">¡Email válido!</mat-hint>
          <mat-error *ngIf="form.controls['email'].hasError('required') && form.controls['email'].touched">El email es obligatorio.</mat-error>
          <mat-error *ngIf="form.controls['email'].hasError('email') && form.controls['email'].touched">Formato de email inválido.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width" [color]="isActive('celular') ? 'primary' : undefined">
          <mat-label>Celular</mat-label>
          <input matInput formControlName="celular" placeholder="Ej: 3001234567" maxlength="10" (focus)="setActive('celular')" (blur)="setActive('')" />
          <mat-icon matPrefix>phone</mat-icon>
          <mat-hint *ngIf="form.controls['celular'].valid && form.controls['celular'].touched">¡Celular válido!</mat-hint>
          <mat-error *ngIf="form.controls['celular'].hasError('required') && form.controls['celular'].touched">El celular es obligatorio.</mat-error>
          <mat-error *ngIf="form.controls['celular'].hasError('pattern') && form.controls['celular'].touched">Solo números, 10 dígitos.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width" [color]="isActive('ciudad') ? 'primary' : undefined">
          <mat-label>Ciudad</mat-label>
          <input matInput formControlName="ciudad" placeholder="Ej: Medellín" (focus)="setActive('ciudad')" (blur)="setActive('')" />
          <mat-icon matPrefix>location_city</mat-icon>
          <mat-hint *ngIf="form.controls['ciudad'].valid && form.controls['ciudad'].touched">¡Ciudad válida!</mat-hint>
          <mat-error *ngIf="form.controls['ciudad'].hasError('required') && form.controls['ciudad'].touched">La ciudad es obligatoria.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width" [color]="isActive('direccion') ? 'primary' : undefined">
          <mat-label>Dirección</mat-label>
          <input matInput formControlName="direccion" placeholder="Ej: Calle 123 #45-67" (focus)="setActive('direccion')" (blur)="setActive('')" />
          <mat-icon matPrefix>home</mat-icon>
          <mat-hint *ngIf="form.controls['direccion'].valid && form.controls['direccion'].touched">¡Dirección válida!</mat-hint>
          <mat-error *ngIf="form.controls['direccion'].hasError('required') && form.controls['direccion'].touched">La dirección es obligatoria.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width" [color]="isActive('password') ? 'primary' : undefined">
          <mat-label>Contraseña</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Mínimo 8 caracteres" (focus)="setActive('password')" (blur)="setActive('')" (input)="checkPasswordStrength()" />
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword" [attr.aria-label]="hidePassword ? 'Mostrar contraseña' : 'Ocultar contraseña'" tabindex="0">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-hint *ngIf="form.controls['password'].valid && form.controls['password'].touched">¡Contraseña válida!</mat-hint>
          <mat-error *ngIf="form.controls['password'].hasError('required') && form.controls['password'].touched">La contraseña es obligatoria.</mat-error>
          <mat-error *ngIf="form.controls['password'].hasError('minlength') && form.controls['password'].touched">Mínimo 8 caracteres.</mat-error>
          <mat-error *ngIf="form.controls['password'].hasError('pattern') && form.controls['password'].touched">Debe incluir mayúscula, minúscula, número y símbolo.</mat-error>
          <div class="password-strength">
            <span [ngClass]="passwordStrength">{{ passwordStrengthMsg }}</span>
          </div>
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="loading || !form.valid" style="margin-top: 24px; width: 100%;">Registrarse</button>
      </form>
      <div *ngIf="success" class="success">Registro exitoso. Ahora puedes iniciar sesión.</div>
      <div *ngIf="error" class="error">{{ error }}</div>
    </mat-card>
  `,
  styles: [`
    .register-card {
      max-width: 400px;
      margin: 80px auto 80px auto;
      padding: 32px 24px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    }
    mat-card-title { font-family: 'Montserrat', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    .full-width { width: 100%; margin-bottom: 12px; }
    .password-strength { margin-top: 4px; font-size: 0.9em; }
    .password-strength .weak { color: #d32f2f; }
    .password-strength .medium { color: #fbc02d; }
    .password-strength .strong { color: #388e3c; }
    button[mat-raised-button] { margin-top: 24px; font-weight: 600; }
    input:focus { outline: 2px solid #1976d2; }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  success = false;
  error = '';
  hidePassword = true;
  passwordStrength = '';
  passwordStrengthMsg = '';
  activeField = '';
  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)]]
    });
  }
  setActive(field: string) { this.activeField = field; }
  isActive(field: string) { return this.activeField === field; }
  checkPasswordStrength() {
    const value = this.form.controls['password'].value || '';
    if (value.length < 8) {
      this.passwordStrength = 'weak';
      this.passwordStrengthMsg = 'Débil';
    } else if (value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
      this.passwordStrength = 'medium';
      this.passwordStrengthMsg = 'Media';
    } else if (value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)) {
      this.passwordStrength = 'strong';
      this.passwordStrengthMsg = 'Fuerte';
    } else {
      this.passwordStrength = 'weak';
      this.passwordStrengthMsg = 'Débil';
    }
  }
  register() {
    if (this.form.invalid) return;
    this.loading = true;
    this.success = false;
    this.error = '';
    const { nombre, email, password, celular, ciudad, direccion } = this.form.value;
    this.auth.register(nombre, email, password, celular, ciudad, direccion).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error || 'Error al registrar usuario';
        this.loading = false;
      }
    });
  }
} 