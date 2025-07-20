import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <mat-card class="profile-card">
      <mat-card-title>Mi Perfil</mat-card-title>
      <form #form="ngForm" (ngSubmit)="save()" autocomplete="off" novalidate>
        <div class="profile-row" *ngFor="let field of fields">
          <mat-form-field appearance="outline" class="full-width" [color]="editField === field.key ? 'primary' : undefined">
            <mat-label>{{ field.label }}</mat-label>
            <input matInput
              type="text"
              [name]="field.key"
              [(ngModel)]="user[field.key]"
              [required]="field.required"
              [readonly]="editField !== field.key"
              [placeholder]="field.placeholder"
              (focus)="setActive(field.key)"
              (blur)="setActive('')"
              [ngClass]="{ editable: editField === field.key }"
              (ngModelChange)="validateField(field.key)"
            />
            <mat-icon matPrefix>{{ field.icon }}</mat-icon>
            <button *ngIf="editField !== field.key" mat-icon-button matSuffix type="button" (click)="editField = field.key">
              <mat-icon>edit</mat-icon>
            </button>
            <button *ngIf="editField === field.key" mat-icon-button matSuffix type="button" (click)="saveField(field.key)">
              <mat-icon>check</mat-icon>
            </button>
            <button *ngIf="editField === field.key" mat-icon-button matSuffix type="button" (click)="cancelEdit()">
              <mat-icon>close</mat-icon>
            </button>
            <mat-error *ngIf="fieldErrors[field.key]">{{ fieldErrors[field.key] }}</mat-error>
            <mat-hint *ngIf="!fieldErrors[field.key] && editField === field.key && user[field.key]">¡Valor válido!</mat-hint>
          </mat-form-field>
        </div>
        <div class="profile-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput name="email" [(ngModel)]="user.email" required readonly />
            <mat-icon matPrefix>mail</mat-icon>
          </mat-form-field>
        </div>
      </form>
      <div *ngIf="success" class="success">¡Perfil actualizado!</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <mat-divider style="margin: 32px 0 16px 0;"></mat-divider>
      <div class="password-section">
        <h3>Cambiar contraseña</h3>
        <form #passForm="ngForm" (ngSubmit)="changePassword()" autocomplete="off" novalidate>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña actual</mat-label>
            <input matInput [type]="hideCurrent ? 'password' : 'text'" name="current" [(ngModel)]="passwords.current" required />
            <button mat-icon-button matSuffix type="button" (click)="hideCurrent = !hideCurrent" tabindex="0">
              <mat-icon>{{ hideCurrent ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nueva contraseña</mat-label>
            <input matInput [type]="hideNew ? 'password' : 'text'" name="new" [(ngModel)]="passwords.new" required (input)="checkPasswordStrength()" />
            <button mat-icon-button matSuffix type="button" (click)="hideNew = !hideNew" tabindex="0">
              <mat-icon>{{ hideNew ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <div class="password-strength">
              <span [ngClass]="passwordStrength">{{ passwordStrengthMsg }}</span>
            </div>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmar nueva contraseña</mat-label>
            <input matInput [type]="hideConfirm ? 'password' : 'text'" name="confirm" [(ngModel)]="passwords.confirm" required />
            <button mat-icon-button matSuffix type="button" (click)="hideConfirm = !hideConfirm" tabindex="0">
              <mat-icon>{{ hideConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="!canChangePassword()">Actualizar contraseña</button>
        </form>
        <div *ngIf="passSuccess" class="success">¡Contraseña actualizada!</div>
        <div *ngIf="passError" class="error">{{ passError }}</div>
      </div>
    </mat-card>
  `,
  styles: [`
    .profile-card {
      max-width: 480px;
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
    .profile-row { margin-bottom: 8px; }
    .editable { background: #e3f2fd; }
    .password-section { margin-top: 32px; }
    .password-section h3 { margin-bottom: 16px; font-size: 1.1rem; font-weight: 600; }
    .password-strength { margin-top: 4px; font-size: 0.9em; }
    .password-strength .weak { color: #d32f2f; }
    .password-strength .medium { color: #fbc02d; }
    .password-strength .strong { color: #388e3c; }
    button[mat-raised-button] { margin-top: 24px; font-weight: 600; }
    input:focus { outline: 2px solid #1976d2; }
  `]
})
export class ProfileComponent {
  user: any = { nombre: '', email: '', celular: '', ciudad: '', direccion: '' };
  fields = [
    { key: 'nombre', label: 'Nombre completo', icon: 'person', required: true, placeholder: 'Ej: Juan Pérez' },
    { key: 'celular', label: 'Celular', icon: 'phone', required: true, placeholder: 'Ej: 3001234567' },
    { key: 'ciudad', label: 'Ciudad', icon: 'location_city', required: true, placeholder: 'Ej: Medellín' },
    { key: 'direccion', label: 'Dirección', icon: 'home', required: true, placeholder: 'Ej: Calle 123 #45-67' },
  ];
  fieldErrors: any = {};
  editField: string | null = null;
  activeField = '';
  success = false;
  error = '';
  // Contraseña
  passwords = { current: '', new: '', confirm: '' };
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  passwordStrength = '';
  passwordStrengthMsg = '';
  passSuccess = false;
  passError = '';
  clientId: number | null = null;
  constructor(private auth: AuthService) {
    const user = this.auth.getUserFromToken() as any || {};
    this.user.nombre = user?.nombre || '';
    this.user.email = user?.email || '';
    this.user.celular = user?.celular || '';
    this.user.ciudad = user?.ciudad || '';
    this.user.direccion = user?.direccion || '';
    this.user.id = user?.id;
    this.clientId = user?.clientId;
  }
  setActive(field: string) { this.activeField = field; }
  validateField(key: string) {
    const value = this.user[key] || '';
    if (!value) {
      this.fieldErrors[key] = 'Este campo es obligatorio.';
    } else if (key === 'celular' && !/^\d{10}$/.test(value)) {
      this.fieldErrors[key] = 'Debe ser un número de 10 dígitos.';
    } else if (key === 'nombre' && value.length < 3) {
      this.fieldErrors[key] = 'Mínimo 3 caracteres.';
    } else {
      this.fieldErrors[key] = '';
    }
  }
  saveField(key: string) {
    this.validateField(key);
    if (this.fieldErrors[key]) return;
    console.log('saveField called', { key, user: this.user, userId: this.user.id, clientId: this.clientId });
    const updateUserFields = ['nombre', 'email'];
    const updateClientFields = ['celular', 'ciudad', 'direccion'];
    const userUpdate: any = {};
    const clientUpdate: any = {};
    if (updateUserFields.includes(key)) {
      userUpdate.nombre = this.user.nombre;
      userUpdate.email = this.user.email;
      this.auth.updateUser(this.user.id, userUpdate).subscribe({
        next: (updated) => {
          console.log('updateUser response', updated);
          this.auth.setToken(this.auth.getToken()!, {
            phone: this.user.celular,
            ciudad: this.user.ciudad,
            direccion: this.user.direccion
          }, this.clientId!);
          this.success = true;
          setTimeout(() => this.success = false, 2000);
        },
        error: (err) => {
          console.error('updateUser error', err);
          this.error = 'Error al actualizar el perfil';
        }
      });
    }
    if (updateClientFields.includes(key) && this.clientId != null) {
      clientUpdate.phone = this.user.celular;
      clientUpdate.ciudad = this.user.ciudad;
      clientUpdate.direccion = this.user.direccion;
      this.auth.updateClient(this.clientId!, clientUpdate).subscribe({
        next: (updated) => {
          console.log('updateClient response', updated);
          this.auth.setToken(this.auth.getToken()!, {
            phone: updated.phone,
            ciudad: updated.ciudad,
            direccion: updated.direccion
          }, this.clientId!);
          this.success = true;
          setTimeout(() => this.success = false, 2000);
        },
        error: (err) => {
          console.error('updateClient error', err);
          this.error = 'Error al actualizar el perfil';
        }
      });
    }
    this.editField = null;
  }
  cancelEdit() {
    this.editField = null;
    this.error = '';
  }
  save() {
    // Guardar todos los campos a la vez
    console.log('save called', { user: this.user, userId: this.user.id, clientId: this.clientId });
    const userUpdate = {
      nombre: this.user.nombre,
      email: this.user.email
    };
    const clientUpdate = {
      phone: this.user.celular,
      ciudad: this.user.ciudad,
      direccion: this.user.direccion
    };
    this.auth.updateUser(this.user.id, userUpdate).subscribe({
      next: (updatedUser) => {
        console.log('updateUser response', updatedUser);
        if (this.clientId != null) {
          this.auth.updateClient(this.clientId!, clientUpdate).subscribe({
            next: (updatedClient) => {
              console.log('updateClient response', updatedClient);
              this.auth.setToken(this.auth.getToken()!, {
                phone: updatedClient.phone,
                ciudad: updatedClient.ciudad,
                direccion: updatedClient.direccion
              }, this.clientId!);
              this.success = true;
              setTimeout(() => this.success = false, 2000);
            },
            error: (err) => {
              console.error('updateClient error', err);
              this.error = 'Error al actualizar los datos personales';
            }
          });
        }
      },
      error: (err) => {
        console.error('updateUser error', err);
        this.error = 'Error al actualizar el usuario';
      }
    });
  }
  checkPasswordStrength() {
    const value = this.passwords.new || '';
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
  canChangePassword() {
    return this.passwords.current && this.passwords.new && this.passwords.confirm &&
      this.passwords.new === this.passwords.confirm;
  }
  changePassword() {
    if (!this.canChangePassword()) return;
    if (!this.user.id) {
      this.passError = 'No se pudo identificar el usuario.';
      return;
    }
    this.auth.changePassword(Number(this.user.id), this.passwords.current, this.passwords.new).subscribe({
      next: (res) => {
        this.passSuccess = true;
        this.passError = '';
        setTimeout(() => this.passSuccess = false, 2000);
        this.passwords = { current: '', new: '', confirm: '' };
        this.passwordStrength = '';
        this.passwordStrengthMsg = '';
      },
      error: (err) => {
        this.passError = err?.error || 'Error al cambiar la contraseña';
        this.passSuccess = false;
      }
    });
  }
} 