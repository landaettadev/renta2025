import { Component } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.scss']
})
export class BookingCreateComponent {
  booking: Partial<Booking> = {};
  loading = false;
  success = false;
  error = '';

  constructor(private bookingService: BookingService) {}

  create() {
    if (!this.booking.vehicleId || !this.booking.clientId || !this.booking.startDate || !this.booking.endDate) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
    this.loading = true;
    this.success = false;
    this.error = '';
    this.bookingService.create(this.booking as Booking).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al crear la reserva';
        this.loading = false;
      }
    });
  }
} 