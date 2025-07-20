import { Component, OnInit } from '@angular/core';
import { BookingService } from './core/services/booking.service';
import { Booking } from './core/models/booking.model';
import { AuthService } from './core/services/auth.service';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [MatCardModule, CommonModule, DatePipe, MatIconModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatOptionModule, MatProgressSpinnerModule],
  template: `
    <mat-card class="booking-history-card">
      <mat-card-title>Historial de Reservas</mat-card-title>
      <div *ngIf="loading" class="loader-container">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
      <div class="filters" *ngIf="!loading">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Buscar</mat-label>
          <input matInput [(ngModel)]="search" placeholder="Placa o modelo..." />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Estado</mat-label>
          <mat-select [(ngModel)]="filterEstado" name="estado">
            <mat-option value="">Todos</mat-option>
            <mat-option *ngFor="let s of estados" [value]="s.value">{{ s.label }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Tipo</mat-label>
          <mat-select [(ngModel)]="filterTipo" name="tipo">
            <mat-option value="">Todos</mat-option>
            <mat-option *ngFor="let t of tipos" [value]="t">{{ t }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div *ngIf="groupedBookings.length === 0 && !loading" class="empty">No tienes reservas registradas.</div>
      <ng-container *ngFor="let group of groupedBookings">
        <div class="group-title">{{ group.label }}</div>
        <div *ngFor="let b of group.items" class="booking-item">
          <div class="booking-card">
            <div class="vehicle-img">
              <img [src]="b.vehicle?.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" width="90" height="60" style="object-fit:cover; border-radius:8px;" />
            </div>
            <div class="booking-info">
              <div class="vehicle-main">
                <span class="vehicle-model">{{ b.vehicle?.brand }} {{ b.vehicle?.model }}</span>
                <span class="vehicle-type">({{ b.vehicle?.type }})</span>
                <span class="vehicle-plate">Placa: {{ b.vehicle?.licensePlate }}</span>
              </div>
              <div class="dates">
                <mat-icon>event</mat-icon>
                <span>{{ b.startDate | date:'dd/MM/yyyy' }} - {{ b.endDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="status-row">
                <mat-chip [ngClass]="statusClass(b)" selected>
                  <mat-icon>{{ statusIcon(b) }}</mat-icon>
                  {{ getStatusLabel(b) }}
                </mat-chip>
              </div>
            </div>
            <div class="actions">
              <button mat-raised-button color="warn" *ngIf="canCancel(b)" (click)="cancelar(b.id)" [disabled]="b.estado !== 0">
                <mat-icon>cancel</mat-icon> Cancelar
              </button>
              <button mat-raised-button color="warn" disabled *ngIf="!canCancel(b)">
                <mat-icon>block</mat-icon> No disponible
              </button>
            </div>
          </div>
        </div>
      </ng-container>
    </mat-card>
  `,
  styles: [`
    .booking-history-card {
      max-width: 800px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    }
    .loader-container { display: flex; justify-content: center; align-items: center; min-height: 120px; }
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .filter-field { min-width: 160px; flex: 1; }
    .group-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 32px 0 12px 0;
      color: #1976d2;
      letter-spacing: 0.5px;
    }
    .booking-item { margin-bottom: 18px; }
    .booking-card {
      display: flex;
      align-items: flex-start;
      background: #f8fafc;
      border-radius: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      padding: 16px 18px;
      gap: 18px;
      position: relative;
    }
    .vehicle-img { flex-shrink: 0; }
    .booking-info { flex: 1; }
    .vehicle-main { font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; }
    .vehicle-type { color: #888; font-size: 0.95em; margin-left: 8px; }
    .vehicle-plate { color: #555; font-size: 0.95em; margin-left: 8px; }
    .dates { display: flex; align-items: center; color: #1976d2; font-size: 0.98em; margin: 6px 0; gap: 4px; }
    .status-row { margin: 8px 0; }
    mat-chip.pendiente { background: #fff3cd; color: #b8860b; }
    mat-chip.confirmada { background: #e3fcef; color: #388e3c; }
    mat-chip.cancelada { background: #ffeaea; color: #d32f2f; }
    mat-chip.completada { background: #e3e9fc; color: #1976d2; }
    .actions { display: flex; flex-direction: column; gap: 8px; margin-left: 12px; }
    .empty { color: #888; margin: 24px 0; text-align: center; }
    @media (max-width: 700px) {
      .booking-history-card { padding: 8px; }
      .booking-card { flex-direction: column; align-items: stretch; gap: 8px; }
      .actions { flex-direction: row; margin-left: 0; }
    }
  `]
})
export class BookingHistoryComponent implements OnInit {
  bookings: (Booking & { vehicle?: Vehicle })[] = [];
  groupedBookings: { label: string, items: (Booking & { vehicle?: Vehicle })[] }[] = [];
  loading = false;
  estados = [
    { value: 0, label: 'Pendiente' },
    { value: 1, label: 'Confirmada' },
    { value: 2, label: 'Cancelada' },
    { value: 3, label: 'Completada' }
  ];
  tipos: string[] = [];
  filterEstado: string = '';
  filterTipo: string = '';
  search: string = '';
  constructor(
    private bookingService: BookingService,
    private vehicleService: VehicleService,
    private auth: AuthService
  ) {}
  ngOnInit() {
    const user = this.auth.getUserFromToken();
    if (user) {
      this.loading = true;
      this.bookingService.getHistory(Number(user.id)).subscribe({
        next: (bookings) => {
          this.vehicleService.getAll().subscribe({
            next: (vehicles) => {
              this.bookings = bookings.map(b => ({
                ...b,
                vehicle: vehicles.find(v => v.id === b.vehicleId)
              }));
              this.tipos = Array.from(new Set(this.bookings.map(b => b.vehicle?.type).filter((t): t is string => !!t)));
              this.applyFilters();
              this.loading = false;
            },
            error: () => {
              this.bookings = bookings;
              this.applyFilters();
              this.loading = false;
            }
          });
        },
        error: () => { this.bookings = []; this.applyFilters();
          this.loading = false;
        }
      });
    }
  }
  applyFilters() {
    let filtered = this.bookings;
    if (this.filterEstado !== '') filtered = filtered.filter(b => String(b.estado) === String(this.filterEstado));
    if (this.filterTipo !== '') filtered = filtered.filter(b => b.vehicle?.type === this.filterTipo);
    if (this.search.trim()) {
      const s = this.search.trim().toLowerCase();
      filtered = filtered.filter(b =>
        (b.vehicle?.licensePlate || '').toLowerCase().includes(s) ||
        (b.vehicle?.model || '').toLowerCase().includes(s)
      );
    }
    // Agrupar por mes y año
    const groups: { [key: string]: (Booking & { vehicle?: Vehicle })[] } = {};
    for (const b of filtered) {
      const date = new Date(b.startDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(b);
    }
    this.groupedBookings = Object.entries(groups).map(([key, items]) => {
      const [year, month] = key.split('-');
      const label = `${this.getMonthName(Number(month))} ${year}`;
      return { label, items };
    }).sort((a, b) => b.label.localeCompare(a.label));
  }
  getMonthName(month: number) {
    return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][month] || '';
  }
  cancelar(id: number) {
    const user = this.auth.getUserFromToken();
    if (!user) return;
    if (confirm('¿Seguro que deseas cancelar esta reserva?')) {
      this.bookingService.cancel(id, Number(user.id)).subscribe(() => this.ngOnInit());
    }
  }
  canCancel(b: any) {
    return b.estado === 0;
  }
  statusClass(b: any) {
    const status = this.getStatus(b);
    if (status === 'Pending' || b.estado === 0) return 'pendiente';
    if (status === 'Confirmed' || b.estado === 1) return 'confirmada';
    if (status === 'Completed' || b.estado === 3) return 'completada';
    if (status === 'Cancelled' || b.estado === 2) return 'cancelada';
    return '';
  }
  statusIcon(b: any) {
    const status = this.getStatus(b);
    if (status === 'Pending' || b.estado === 0) return 'hourglass_empty';
    if (status === 'Confirmed' || b.estado === 1) return 'check_circle';
    if (status === 'Completed' || b.estado === 3) return 'done_all';
    if (status === 'Cancelled' || b.estado === 2) return 'cancel';
    return 'help';
  }
  getStatus(b: any): string {
    return b.status || (b.estado === 0 ? 'Pending' : b.estado === 1 ? 'Confirmed' : b.estado === 2 ? 'Cancelled' : b.estado === 3 ? 'Completed' : '');
  }
  getStatusLabel(b: any): string {
    const status = this.getStatus(b);
    switch (status) {
      case 'Pending': return 'Pendiente';
      case 'Confirmed': return 'Confirmada';
      case 'Cancelled': return 'Cancelada';
      case 'Completed': return 'Completada';
      default: return '';
    }
  }
} 