import { Component, OnInit } from '@angular/core';
import { BookingService } from './core/services/booking.service';
import { Booking } from './core/models/booking.model';
import { AuthService } from './core/services/auth.service';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [MatCardModule, CommonModule, DatePipe],
  template: `
    <mat-card class="booking-history-card">
      <mat-card-title>Historial de Reservas</mat-card-title>
      <div *ngIf="bookings.length === 0" class="empty">No tienes reservas registradas.</div>
      <div *ngFor="let b of bookings" class="booking-item">
        <div class="vehicle-info">
          <img [src]="b.vehicle?.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" width="80" height="50" style="object-fit:cover; border-radius:6px; margin-right:12px;" />
          <div>
            <div><b>{{ b.vehicle?.brand }} {{ b.vehicle?.model }}</b> ({{ b.vehicle?.type }})</div>
            <div>Placa: {{ b.vehicle?.licensePlate }}</div>
          </div>
        </div>
        <div><b>Fechas:</b> {{ b.startDate | date }} - {{ b.endDate | date }}</div>
        <div><b>Estado:</b> <span [ngClass]="{
          'pendiente': b.estado === 0,
          'confirmada': b.estado === 1,
          'cancelada': b.estado === 2
        }">{{ estadoLabel(b.estado) }}</span></div>
        <button *ngIf="b.estado === 0" mat-button color="warn" (click)="cancelar(b.id)">Cancelar</button>
      </div>
    </mat-card>
  `,
  styles: [`
    .booking-history-card {
      max-width: 600px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
    }
    .booking-item {
      margin-bottom: 24px;
      padding: 16px 0 12px 0;
      border-bottom: 1px solid #eee;
      font-family: 'Montserrat', sans-serif;
    }
    .vehicle-info {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
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
} 