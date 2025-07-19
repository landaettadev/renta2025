import { Component, OnInit } from '@angular/core';
import { BookingService } from './core/services/booking.service';
import { Booking } from './core/models/booking.model';
import { AuthService } from './core/services/auth.service';
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
        <div><b>Vehículo:</b> {{ b.vehicleId }}</div>
        <div><b>Fechas:</b> {{ b.startDate | date }} - {{ b.endDate | date }}</div>
        <div><b>Estado:</b> {{ b.status }}</div>
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
      margin-bottom: 18px;
      padding: 12px;
      border-bottom: 1px solid #eee;
      font-family: 'Montserrat', sans-serif;
    }
    .empty { color: #888; margin: 24px 0; text-align: center; }
  `]
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  constructor(private bookingService: BookingService, private auth: AuthService) {}
  ngOnInit() {
    const user = this.auth.getUserFromToken();
    if (user) {
      this.bookingService.getHistory(Number(user.id)).subscribe({
        next: (bookings) => this.bookings = bookings,
        error: () => this.bookings = []
      });
    }
  }
} 