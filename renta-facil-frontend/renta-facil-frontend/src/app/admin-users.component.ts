import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, FormsModule],
  template: `
    <mat-card class="admin-users-card">
      <mat-card-title>Gestión de Usuarios</mat-card-title>
      <div class="admin-users-filters">
        <form class="users-filter-form" autocomplete="off" (ngSubmit)="$event.preventDefault()">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput [(ngModel)]="filterName" name="filterName" placeholder="Buscar por nombre" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Correo</mat-label>
            <input matInput [(ngModel)]="filterEmail" name="filterEmail" placeholder="Buscar por correo" />
          </mat-form-field>
          <button mat-stroked-button type="button" (click)="filterName='';filterEmail=''">Limpiar</button>
        </form>
      </div>
      <div *ngIf="filteredUsers.length === 0" class="empty">No hay usuarios registrados.</div>
      <div *ngFor="let u of filteredUsers; let i = index" class="user-item">
        <form [formGroup]="editForms[u.id]" (ngSubmit)="onUpdate(u.id)" *ngIf="editingId === u.id; else viewMode" class="edit-user-form">
          <span class="emoji">✏️</span>
          <input matInput formControlName="nombre" placeholder="Nombre" />
          <input matInput formControlName="email" placeholder="Email" />
          <input matInput formControlName="rol" placeholder="Rol" />
          <input matInput formControlName="password" placeholder="Nueva contraseña (opcional)" type="password" />
          <button mat-raised-button color="primary" type="submit">💾 Guardar</button>
          <button mat-button type="button" (click)="cancelEdit()">❌ Cancelar</button>
        </form>
        <ng-template #viewMode>
          <div class="user-row">
            <span class="user-index">{{ i + 1 }}.</span>
            <span class="user-name"><b>{{ u.nombre }}</b> ({{ u.rol }})</span>
            <span class="user-email">{{ u.email }}</span>
          </div>
          <div class="user-actions">
            <button mat-icon-button color="primary" (click)="startEdit(u)" title="Editar"><span class="emoji">✏️</span></button>
            <button mat-icon-button color="warn" (click)="onDelete(u.id)" title="Eliminar"><span class="emoji">🗑️</span></button>
          </div>
        </ng-template>
      </div>
    </mat-card>
  `,
  styles: [`
    .admin-users-card {
      max-width: 700px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
    }
    .admin-users-filters {
      margin-bottom: 18px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      padding: 12px 18px 6px 18px;
      margin-top: 8px;
    }
    .users-filter-form {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .users-filter-form mat-form-field {
      min-width: 140px;
      flex: 1;
    }
    .users-filter-form button {
      margin-bottom: 4px;
      border-radius: 24px;
      padding: 8px 22px;
      font-weight: 600;
      font-size: 1.01rem;
      color: #ff9800;
      border-color: #ff9800;
      transition: border 0.18s, color 0.18s;
    }
    .users-filter-form button:hover {
      color: #ff5e62;
      border-color: #ff5e62;
    }
    .user-item {
      margin-bottom: 24px;
      padding: 16px 0 12px 0;
      border-bottom: 1px solid #eee;
      font-family: 'Montserrat', sans-serif;
    }
    .edit-user-form {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      border-radius: 8px;
      padding: 10px 8px;
      margin-bottom: 4px;
    }
    .edit-user-form .emoji { font-size: 1.3rem; margin-right: 4px; }
    .user-row {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.08rem;
    }
    .user-index {
      font-weight: 700;
      color: #1976d2;
      font-size: 1.1rem;
      margin-right: 4px;
    }
    .user-name { font-weight: 700; }
    .user-email { color: #888; font-size: 0.98rem; margin-left: 8px; }
    .user-actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }
    .user-actions .emoji { font-size: 1.2rem; }
    .empty { color: #888; margin: 24px 0; text-align: center; }
    input[matInput] { margin-right: 8px; margin-bottom: 8px; }
    button { margin-right: 8px; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  editingId: number|null = null;
  editForms: { [id: number]: FormGroup } = {};
  filterName: string = '';
  filterEmail: string = '';

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.auth.getAllUsers().subscribe(users => {
      this.users = users;
      this.editForms = {};
      users.forEach(u => {
        this.editForms[u.id] = this.fb.group({
          nombre: [u.nombre],
          email: [u.email],
          rol: [u.rol],
          password: ['']
        });
      });
    });
  }

  startEdit(u: any) {
    this.editingId = u.id;
  }

  cancelEdit() {
    this.editingId = null;
  }

  onUpdate(id: number) {
    const data = this.editForms[id].value;
    if (!data.password) delete data.password;
    this.auth.updateUser(id, data).subscribe(() => {
      this.editingId = null;
      this.loadUsers();
    });
  }

  onDelete(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.auth.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  get filteredUsers() {
    return this.users.filter(u => {
      let nameOk = true;
      if (this.filterName.trim()) {
        nameOk = (u.nombre || '').toLowerCase().includes(this.filterName.trim().toLowerCase());
      }
      let emailOk = true;
      if (this.filterEmail.trim()) {
        emailOk = (u.email || '').toLowerCase().includes(this.filterEmail.trim().toLowerCase());
      }
      return nameOk && emailOk;
    });
  }
} 