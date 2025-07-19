import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, CommonModule, ReactiveFormsModule],
  template: `
    <mat-card class="admin-users-card">
      <mat-card-title>Gestión de Usuarios</mat-card-title>
      <div *ngIf="users.length === 0" class="empty">No hay usuarios registrados.</div>
      <div *ngFor="let u of users" class="user-item">
        <form [formGroup]="editForms[u.id]" (ngSubmit)="onUpdate(u.id)" *ngIf="editingId === u.id; else viewMode">
          <input matInput formControlName="nombre" placeholder="Nombre" />
          <input matInput formControlName="email" placeholder="Email" />
          <input matInput formControlName="rol" placeholder="Rol" />
          <input matInput formControlName="password" placeholder="Nueva contraseña (opcional)" type="password" />
          <button mat-raised-button color="primary" type="submit">Guardar</button>
          <button mat-button type="button" (click)="cancelEdit()">Cancelar</button>
        </form>
        <ng-template #viewMode>
          <div><b>{{ u.nombre }}</b> ({{ u.rol }})</div>
          <div>{{ u.email }}</div>
          <button mat-button color="primary" (click)="startEdit(u)">Editar</button>
          <button mat-button color="warn" (click)="onDelete(u.id)">Eliminar</button>
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
    .user-item {
      margin-bottom: 24px;
      padding: 16px 0 12px 0;
      border-bottom: 1px solid #eee;
      font-family: 'Montserrat', sans-serif;
    }
    .empty { color: #888; margin: 24px 0; text-align: center; }
    input[matInput] { margin-right: 8px; margin-bottom: 8px; }
    button { margin-right: 8px; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  editingId: number|null = null;
  editForms: { [id: number]: FormGroup } = {};

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
} 