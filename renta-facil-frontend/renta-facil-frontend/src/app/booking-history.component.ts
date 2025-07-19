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

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [MatCardModule, CommonModule, DatePipe, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <mat-card class="booking-history-card">
      <mat-card-title>Historial de Reservas</mat-card-title>
      <div *ngIf="bookings.length === 0" class="empty">No tienes reservas registradas.</div>
      <div *ngFor="let b of bookings" class="booking-history-card-item">
        <mat-card class="booking-item-card">
          <div class="booking-card-header">
            <img [src]="b.vehicle?.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" width="90" height="60" class="veh-img" />
            <div class="veh-info">
              <div class="veh-title">{{ b.vehicle?.brand }} {{ b.vehicle?.model }}</div>
              <div class="veh-type">{{ b.vehicle?.type }} | Placa: {{ b.vehicle?.licensePlate }}</div>
            </div>
            <mat-chip-list class="estado-chip-list">
              <mat-chip [color]="estadoColor(b.estado)" selected>
                <mat-icon>{{ estadoIcon(b.estado) }}</mat-icon>
                {{ estadoLabel(b.estado) }}
              </mat-chip>
            </mat-chip-list>
          </div>
          <div class="booking-card-body">
            <div><b>ID Reserva:</b> {{ b.id }}</div>
            <div><b>Fechas:</b> {{ b.startDate | date }} - {{ b.endDate | date }}</div>
          </div>
          <div class="booking-card-actions">
            <button *ngIf="b.estado === 0" mat-stroked-button color="warn" (click)="cancelar(b.id)">
              <mat-icon>cancel</mat-icon> Cancelar
            </button>
          </div>
        </mat-card>
      </div>
    </mat-card>
  `,
  styles: [`
    .booking-history-card {
      max-width: 700px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
      background: #fff;
    }
    .booking-history-card-item {
      margin-bottom: 24px;
    }
    .booking-item-card {
      padding: 18px 18px 12px 18px;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      background: #fafbfc;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .booking-card-header {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 8px;
    }
    .veh-img {
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 1px 6px rgba(0,0,0,0.08);
    }
    .veh-info {
      flex: 1;
      min-width: 0;
    }
    .veh-title {
      font-weight: 700;
      font-size: 1.18rem;
      color: #222;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .veh-type {
      font-size: 1.01rem;
      color: #888;
      margin-bottom: 2px;
    }
    .estado-chip-list {
      margin-left: auto;
      min-width: 120px;
      display: flex;
      justify-content: flex-end;
    }
    .booking-card-body {
      display: flex;
      gap: 32px;
      font-size: 1.05rem;
      color: #444;
      margin-bottom: 4px;
    }
    .booking-card-actions {
      display: flex;
      justify-content: flex-end;
    }
    .empty { color: #888; margin: 24px 0; text-align: center; }
  `]
})
export class BookingHistoryComponent implements OnInit {
  bookings: (Booking & { vehicle?: Vehicle })[] = [];
  constructor(
    private bookingService: BookingService,
    private vehicleService: VehicleService,
    private auth: AuthService
  ) {}
  ngOnInit() {
    const user = this.auth.getUserFromToken();
    if (user) {
      this.bookingService.getHistory(Number(user.id)).subscribe({
        next: (bookings) => {
          this.vehicleService.getAll().subscribe({
            next: (vehicles) => {
              this.bookings = bookings.map(b => ({
                ...b,
                vehicle: vehicles.find(v => v.id === b.vehicleId)
              }));
            },
            error: () => {
              this.bookings = bookings;
            }
          });
        },
        error: () => this.bookings = []
      });
    }
  }
  cancelar(id: number) {
    const user = this.auth.getUserFromToken();
    if (!user) return;
    if (confirm('¿Seguro que deseas cancelar esta reserva?')) {
      this.bookingService.cancel(id, Number(user.id)).subscribe(() => this.ngOnInit());
    }
  }
  estadoLabel(estado: number) {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'Confirmada';
      case 2: return 'Cancelada';
      default: return 'Desconocido';
    }
  }
  estadoColor(estado: number) {
    switch (estado) {
      case 1: return 'primary'; // Confirmada
      case 2: return 'warn';    // Cancelada
      case 0: return 'accent';  // Pendiente
      default: return '';
    }
  }
  estadoIcon(estado: number) {
    switch (estado) {
      case 1: return 'check_circle';
      case 2: return 'cancel';
      case 0: return 'hourglass_empty';
      default: return 'help_outline';
    }
  }
} 