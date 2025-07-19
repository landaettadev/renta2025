import { Component, OnInit } from '@angular/core';
import { BookingService } from './core/services/booking.service';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { Booking } from './core/models/booking.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [MatCardModule, CommonModule, DatePipe],
  template: `
    <mat-card class="admin-bookings-card">
      <mat-card-title>Gestión de Reservas</mat-card-title>
      <div *ngIf="bookings.length === 0" class="empty">No hay reservas registradas.</div>
      <div *ngFor="let b of bookings" class="booking-item">
        <div class="vehicle-info">
          <img [src]="b.vehicle?.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" width="80" height="50" style="object-fit:cover; border-radius:6px; margin-right:12px;" />
          <div>
            <div><b>{{ b.vehicle?.brand }} {{ b.vehicle?.model }}</b> ({{ b.vehicle?.type }})</div>
            <div>Placa: {{ b.vehicle?.licensePlate }}</div>
          </div>
        </div>
        <div><b>Usuario ID:</b> {{ b.clientId }}</div>
        <div><b>Fechas:</b> {{ b.startDate | date }} - {{ b.endDate | date }}</div>
        <div><b>Estado:</b> {{ b.status }}</div>
      </div>
    </mat-card>
  `,
  styles: [`
    .admin-bookings-card {
      max-width: 700px;
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
export class AdminBookingsComponent implements OnInit {
  bookings: (Booking & { vehicle?: Vehicle })[] = [];
  constructor(
    private bookingService: BookingService,
    private vehicleService: VehicleService
  ) {}
  ngOnInit() {
    this.bookingService.getAll().subscribe({
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