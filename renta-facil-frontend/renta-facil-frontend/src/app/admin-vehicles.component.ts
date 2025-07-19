import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VehicleService, Vehicle } from './core/services/vehicle.service';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule, MatSelectModule, MatIconModule, MatSnackBarModule],
  template: `
    <mat-card class="admin-vehicle-card">
      <mat-card-title>Agregar Vehículo</mat-card-title>
      <form (ngSubmit)="addVehicle()" #form="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Marca</mat-label>
          <input matInput name="brand" [(ngModel)]="vehicle.brand" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Modelo</mat-label>
          <input matInput name="model" [(ngModel)]="vehicle.model" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select name="type" [(ngModel)]="vehicle.type" required>
            <mat-option value="Sedan">Sedan</mat-option>
            <mat-option value="SUV">SUV</mat-option>
            <mat-option value="Hatchback">Hatchback</mat-option>
            <mat-option value="Pickup">Pickup</mat-option>
            <mat-option value="Otro">Otro</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Placa</mat-label>
          <input matInput name="licensePlate" [(ngModel)]="vehicle.licensePlate" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Disponibilidad</mat-label>
          <mat-select name="isAvailable" [(ngModel)]="vehicle.isAvailable" required>
            <mat-option [value]="true">Disponible</mat-option>
            <mat-option [value]="false">No disponible</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="image-upload">
          <label>Imagen del vehículo:</label>
          <input type="file" (change)="onFileChange($event)" accept="image/*" />
          <img *ngIf="vehicle.image" [src]="vehicle.image" alt="Preview" class="preview-img" />
        </div>
        <button mat-raised-button color="primary" type="submit" [disabled]="loading || !form.valid">Agregar</button>
      </form>
      <div *ngIf="success" class="success">Vehículo agregado exitosamente.</div>
      <div *ngIf="error" class="error">{{ error }}</div>
    </mat-card>
    <mat-card class="admin-vehicle-list">
      <mat-card-title>Vehículos Registrados</mat-card-title>
      <mat-list>
        <mat-list-item *ngFor="let v of vehicles">
          <img [src]="v.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" width="60" height="40" style="object-fit:cover; margin-right:12px; border-radius:4px;" />
          <span>{{ v.brand }} {{ v.model }} ({{ v.type }}) - Placa: {{ v.licensePlate }} - <span [ngClass]="{'disponible': v.isAvailable, 'nodisponible': !v.isAvailable}">{{ v.isAvailable ? 'Disponible' : 'No disponible' }}</span></span>
          <button mat-icon-button color="primary" (click)="toggleDisponibilidad(v)"><mat-icon>{{ v.isAvailable ? 'toggle_on' : 'toggle_off' }}</mat-icon></button>
          <button mat-icon-button color="warn" (click)="deleteVehicle(v)"><mat-icon>delete</mat-icon></button>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `,
  styles: [`
    .admin-vehicle-card, .admin-vehicle-list {
      max-width: 600px;
      margin: 32px auto;
      border-radius: 12px;
    }
    .image-upload { margin: 16px 0; }
    .preview-img { width: 120px; height: 80px; object-fit: cover; border-radius: 8px; margin-top: 8px; }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    .disponible { color: #388e3c; font-weight: 600; }
    .nodisponible { color: #d32f2f; font-weight: 600; }
  `]
})
export class AdminVehiclesComponent implements OnInit {
  vehicle: Partial<Vehicle> = { isAvailable: true };
  vehicles: Vehicle[] = [];
  loading = false;
  error = '';
  success = false;
  constructor(private vehicleService: VehicleService, private snackBar: MatSnackBar) {}
  ngOnInit() {
    this.loadVehicles();
  }
  loadVehicles() {
    this.vehicleService.getAll().subscribe({
      next: (vehicles) => this.vehicles = vehicles,
      error: () => this.vehicles = []
    });
  }
  addVehicle() {
    this.loading = true;
    this.error = '';
    this.success = false;
    this.vehicleService.register(this.vehicle as Vehicle).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.vehicle = { isAvailable: true };
        this.loadVehicles();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Error al registrar vehículo.';
      }
    });
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vehicle.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  toggleDisponibilidad(v: Vehicle) {
    const updated = { ...v, isAvailable: !v.isAvailable };
    this.vehicleService.register(updated).subscribe({
      next: () => {
        this.snackBar.open('Disponibilidad actualizada', 'Cerrar', { duration: 2000 });
        this.loadVehicles();
      },
      error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 2000 })
    });
  }
  deleteVehicle(v: Vehicle) {
    if (confirm('¿Seguro que deseas eliminar este vehículo?')) {
      this.vehicleService.delete(v.id).subscribe({
        next: () => {
          this.snackBar.open('Vehículo eliminado', 'Cerrar', { duration: 2000 });
          this.loadVehicles();
        },
        error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 2000 })
      });
    }
  }
} 