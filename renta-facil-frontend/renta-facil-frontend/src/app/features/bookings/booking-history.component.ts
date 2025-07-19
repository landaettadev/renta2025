import { Component } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss']
})
export class BookingHistoryComponent {
  clientId: number | null = null;
  bookings: Booking[] = [];
  loading = false;
  searched = false;
  error = '';

  constructor(private bookingService: BookingService) {}

  search() {
    if (!this.clientId) return;
    this.loading = true;
    this.searched = true;
    this.error = '';
    this.bookingService.getHistory(this.clientId).subscribe({
      next: (bookings: Booking[]) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err: any) => {
        this.bookings = [];
        this.error = 'Error al consultar historial';
        this.loading = false;
      }
    });
  }
} 