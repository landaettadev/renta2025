import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  template: `
    <div class="busqueda-header">
      <form class="busqueda-form" (ngSubmit)="buscar()" #form="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Tipo de vehículo</mat-label>
          <mat-select name="tipo" [(ngModel)]="filtroTipo">
            <mat-option value="">Todos</mat-option>
            <mat-option value="Sedan">Sedan</mat-option>
            <mat-option value="SUV">SUV</mat-option>
            <mat-option value="Hatchback">Hatchback</mat-option>
            <mat-option value="Pickup">Pickup</mat-option>
            <mat-option value="Otro">Otro</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="date-field">
          <mat-label>Fecha de recogida</mat-label>
          <input matInput [matDatepicker]="pickerInicio" name="fechaInicio" [(ngModel)]="filtroInicio" autocomplete="off" [matDatepickerFilter]="dateFilter" />
          <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
          <mat-datepicker #pickerInicio></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline" class="date-field">
          <mat-label>Devolución</mat-label>
          <input matInput [matDatepicker]="pickerFin" name="fechaFin" [(ngModel)]="filtroFin" [min]="filtroInicio" autocomplete="off" [matDatepickerFilter]="dateFilter" [disabled]="!filtroInicio" />
          <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
          <mat-datepicker #pickerFin></mat-datepicker>
        </mat-form-field>
        <div class="btn-group">
          <button mat-raised-button class="buscar-btn" type="submit">Buscar</button>
          <button mat-stroked-button class="limpiar-btn" type="button" (click)="limpiar()">Limpiar</button>
        </div>
      </form>
    </div>
    <div class="home-gallery">
      <mat-card class="vehicle-card" *ngFor="let v of vehicles">
        <mat-card-header>
          <mat-card-title>{{ v.brand }} {{ v.model }}</mat-card-title>
          <mat-card-subtitle>{{ v.type }}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image [src]="v.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" alt="Imagen del vehículo" />
        <mat-card-content>
          <p>Placa: {{ v.licensePlate }}</p>
          <p>Estado: <span [ngClass]="{'disponible': v.isAvailable, 'nodisponible': !v.isAvailable}">{{ v.isAvailable ? 'Disponible' : 'No disponible' }}</span></p>
        </mat-card-content>
        <mat-card-actions>
          <div class="reservar-btn-container">
            <button mat-raised-button class="reservar-btn" [disabled]="!v.isAvailable" (click)="reservar(v.id)">
              <span>Reservar</span>
            </button>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .busqueda-header {
      max-width: 1100px;
      margin: 0 auto 32px auto;
      padding: 0 12px;
    }
    .busqueda-form {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      padding: 12px 18px 6px 18px;
      margin-bottom: 12px;
      flex-wrap: nowrap;
    }
    .busqueda-form mat-form-field {
      min-width: 140px;
      flex: 1;
    }
    .date-field {
      max-width: 200px;
      min-width: 180px;
    }
    .busqueda-form .btn-group {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      margin-left: 0;
    }
    .buscar-btn {
      background: linear-gradient(90deg, #ff9800 0%, #ff5e62 100%);
      color: #fff;
      font-weight: 700;
      font-size: 1.05rem;
      border-radius: 24px;
      padding: 8px 22px;
      box-shadow: 0 4px 16px rgba(255,152,0,0.10), 0 1.5px 6px rgba(255,94,98,0.10);
      transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
      margin-bottom: 4px;
    }
    .buscar-btn:hover:not(:disabled), .buscar-btn:focus:not(:disabled) {
      background: linear-gradient(90deg, #ff5e62 0%, #ff9800 100%);
      transform: scale(1.06);
      box-shadow: 0 8px 32px rgba(255,94,98,0.18), 0 2px 8px rgba(255,152,0,0.12);
    }
    .limpiar-btn {
      margin-bottom: 4px;
      border-radius: 24px;
      padding: 8px 22px;
      font-weight: 600;
      font-size: 1.01rem;
      color: #ff9800;
      border-color: #ff9800;
      transition: border 0.18s, color 0.18s;
    }
    .limpiar-btn:hover {
      color: #ff5e62;
      border-color: #ff5e62;
    }
    .home-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      margin: 32px 0 64px 0;
      justify-items: center;
    }
    .vehicle-card {
      width: 320px;
      height: 370px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition:
        transform 0.25s cubic-bezier(.4,2,.6,1),
        box-shadow 0.25s cubic-bezier(.4,2,.6,1),
        filter 0.25s;
      background: #fff;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
    }
    .vehicle-card img[mat-card-image] {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 8px 8px 0 0;
    }
    .vehicle-card:hover {
      transform: scale(1.06) translateY(-8px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      z-index: 2;
      filter: brightness(1.05);
    }
    .vehicle-card:not(:hover) {
      filter: brightness(0.95) blur(0.5px);
      transition: filter 0.25s;
    }
    .reservar-btn-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-top: 8px;
    }
    .reservar-btn {
      background: linear-gradient(90deg, #ff9800 0%, #ff5e62 100%);
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 1.08rem;
      border: none;
      border-radius: 24px;
      padding: 10px 32px;
      box-shadow: 0 4px 16px rgba(255,152,0,0.10), 0 1.5px 6px rgba(255,94,98,0.10);
      transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s, background 0.18s;
      letter-spacing: 0.5px;
      outline: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      z-index: 1;
    }
    .reservar-btn:disabled {
      background: #e0e0e0;
      color: #bdbdbd;
      cursor: not-allowed;
      box-shadow: none;
    }
    .reservar-btn:hover:not(:disabled), .reservar-btn:focus:not(:disabled) {
      background: linear-gradient(90deg, #ff5e62 0%, #ff9800 100%);
      transform: scale(1.08);
      box-shadow: 0 8px 32px rgba(255,94,98,0.18), 0 2px 8px rgba(255,152,0,0.12);
    }
    .disponible { color: #388e3c; font-weight: 600; }
    .nodisponible { color: #d32f2f; font-weight: 600; }
  `]
})
export class HomeComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filtroTipo: string = '';
  filtroInicio: any = '';
  filtroFin: any = '';
  constructor(private vehicleService: VehicleService, private router: Router) {}

  ngOnInit() {
    this.cargarTodos();
  }
  cargarTodos() {
    this.vehicleService.getAll().subscribe({
      next: (vehicles) => this.vehicles = vehicles,
      error: () => this.vehicles = []
    });
  }
  buscar() {
    if (!this.filtroTipo && !this.filtroInicio && !this.filtroFin) {
      this.cargarTodos();
      return;
    }
    const inicio = this.filtroInicio ? this.formatearFecha(this.filtroInicio) : '';
    const fin = this.filtroFin ? this.formatearFecha(this.filtroFin) : '';
    this.vehicleService.getAll().subscribe({
      next: (allVehicles) => {
        // Filtrar por tipo si corresponde
        let filteredVehicles = allVehicles;
        if (this.filtroTipo && this.filtroTipo !== 'Todos') {
          filteredVehicles = allVehicles.filter(v => v.type === this.filtroTipo);
        }
        this.vehicleService.getFiltered(this.filtroTipo, inicio, fin).subscribe({
          next: (availableVehicles) => {
            const availableIds = new Set(availableVehicles.map(v => v.id));
            this.vehicles = filteredVehicles.map(v => ({
              ...v,
              isAvailable: availableIds.has(v.id)
            }));
          },
          error: () => {
            this.vehicles = filteredVehicles.map(v => ({ ...v, isAvailable: false }));
          }
        });
      },
      error: () => this.vehicles = []
    });
  }
  limpiar() {
    this.filtroTipo = '';
    this.filtroInicio = '';
    this.filtroFin = '';
    this.cargarTodos();
  }
  formatearFecha(fecha: any): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toISOString().slice(0, 10);
  }
  reservar(vehicleId: number) {
    this.router.navigate(['/reservar', vehicleId], {
      queryParams: {
        startDate: this.filtroInicio ? this.formatearFecha(this.filtroInicio) : '',
        endDate: this.filtroFin ? this.formatearFecha(this.filtroFin) : ''
      }
    });
  }
  today = new Date();
  // Permitir solo fechas desde hoy en adelante
  dateFilter = (d: Date | null): boolean => {
    const today = this.today;
    today.setHours(0,0,0,0);
    return !d || d >= today;
  }
} 