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
      <form (ngSubmit)="addVehicle()" #form="ngForm" class="vehicle-form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Marca</mat-label>
            <input matInput name="brand" [(ngModel)]="vehicle.brand" required />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Modelo</mat-label>
            <input matInput name="model" [(ngModel)]="vehicle.model" required />
          </mat-form-field>
        </div>
        <div class="form-row">
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
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Disponibilidad</mat-label>
            <mat-select name="isAvailable" [(ngModel)]="vehicle.isAvailable" required>
              <mat-option [value]="true">Disponible</mat-option>
              <mat-option [value]="false">No disponible</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="image-upload">
            <label>Imagen:</label>
            <input type="file" (change)="onFileChange($event)" accept="image/*" />
            <img *ngIf="vehicle.image" [src]="vehicle.image" alt="Preview" class="preview-img" />
          </div>
        </div>
        <button mat-raised-button class="agregar-btn" type="submit" [disabled]="loading || !form.valid">
          <span>Agregar</span>
        </button>
        <div *ngIf="success" class="success">Vehículo agregado exitosamente.</div>
        <div *ngIf="error" class="error">{{ error }}</div>
      </form>
    </mat-card>

    <mat-card class="admin-vehicle-list">
      <mat-card-title>Vehículos Registrados</mat-card-title>
      <div class="vehicle-list">
        <div class="vehicle-list-card" *ngFor="let v of vehicles">
          <img [src]="v.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" class="list-img" />
          <div class="vehicle-info">
            <div class="vehicle-title">{{ v.brand }} {{ v.model }} <span class="vehicle-type">({{ v.type }})</span></div>
            <div class="vehicle-plate">Placa: {{ v.licensePlate }}</div>
            <span class="badge" [ngClass]="{'disponible': v.isAvailable, 'nodisponible': !v.isAvailable}">
              {{ v.isAvailable ? 'Disponible' : 'No disponible' }}
            </span>
          </div>
          <div class="vehicle-actions">
            <button mat-icon-button
                    [color]="v.isAvailable ? 'primary' : 'warn'"
                    (click)="toggleDisponibilidad(v)"
                    class="switch-btn">
              <mat-icon>
                {{ v.isAvailable ? 'toggle_on' : 'toggle_off' }}
              </mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteVehicle(v)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .admin-vehicle-card {
      max-width: 700px;
      margin: 32px auto 24px auto;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      padding: 32px 24px 24px 24px;
      background: #fff;
    }
    .vehicle-form .form-row {
      display: flex;
      gap: 24px;
      margin-bottom: 12px;
    }
    .vehicle-form mat-form-field {
      flex: 1;
    }
    .image-upload {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 16px;
    }
    .preview-img {
      width: 100px;
      height: 70px;
      object-fit: cover;
      border-radius: 8px;
      margin-top: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      border: 1.5px solid #eee;
    }
    .agregar-btn {
      display: block;
      margin: 24px auto 0 auto;
      background: linear-gradient(90deg, #ff9800 0%, #ff5e62 100%);
      color: #fff;
      font-weight: 700;
      font-size: 1.1rem;
      border-radius: 24px;
      padding: 12px 40px;
      box-shadow: 0 4px 16px rgba(255,152,0,0.10), 0 1.5px 6px rgba(255,94,98,0.10);
      transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
    }
    .agregar-btn:hover:not(:disabled), .agregar-btn:focus:not(:disabled) {
      background: linear-gradient(90deg, #ff5e62 0%, #ff9800 100%);
      transform: scale(1.06);
      box-shadow: 0 8px 32px rgba(255,94,98,0.18), 0 2px 8px rgba(255,152,0,0.12);
    }
    .vehicle-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin: 24px 0;
    }
    .vehicle-list-card {
      display: flex;
      align-items: center;
      background: #fafbfc;
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      padding: 12px 18px;
      transition: box-shadow 0.18s, transform 0.18s;
    }
    .vehicle-list-card:hover {
      box-shadow: 0 8px 32px rgba(255,152,0,0.13), 0 2px 8px rgba(255,94,98,0.10);
      transform: scale(1.02);
    }
    .list-img {
      width: 80px;
      height: 54px;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 18px;
      border: 1.5px solid #eee;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .vehicle-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .vehicle-title {
      font-weight: 700;
      font-size: 1.1rem;
      color: #333;
    }
    .vehicle-type {
      font-weight: 400;
      color: #888;
      font-size: 0.98rem;
    }
    .vehicle-plate {
      font-size: 0.98rem;
      color: #666;
    }
    .badge {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      margin-top: 4px;
    }
    .disponible {
      background: #e8f5e9;
      color: #388e3c;
    }
    .nodisponible {
      background: #ffebee;
      color: #d32f2f;
    }
    .vehicle-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-left: 18px;
    }
    .vehicle-actions button {
      border-radius: 50%;
      transition: box-shadow 0.18s, background 0.18s;
    }
    .vehicle-actions button:hover {
      box-shadow: 0 2px 8px rgba(255,152,0,0.13);
      background: #fff3e0;
    }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    .switch-btn {
      transition: background 0.18s, box-shadow 0.18s;
    }
    .switch-btn .mat-icon {
      font-size: 2.2rem;
      transition: color 0.18s;
    }
  `]
})
export class AdminVehiclesComponent implements OnInit {
  vehicle: Partial<Vehicle> = { isAvailable: true };
  vehicles: Vehicle[] = [];
  loading = false;
  error = '';
  success = false;
  imageFile: File | null = null;
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
    this.vehicleService.register(this.vehicle, this.imageFile || undefined).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.vehicle = { isAvailable: true };
        this.imageFile = null;
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
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vehicle.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  toggleDisponibilidad(v: Vehicle) {
    const updated = { ...v, isAvailable: !v.isAvailable };
    this.vehicleService.update(updated).subscribe({
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