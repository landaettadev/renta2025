import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { BookingService } from './core/services/booking.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card class="booking-create-card">
      <mat-card-title>Reservar Vehículo</mat-card-title>
      <form (ngSubmit)="create()" #form="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Vehículo</mat-label>
          <select matInput name="vehicleId" [(ngModel)]="booking.vehicleId" required>
            <option *ngFor="let v of vehicles" [value]="v.id">{{ v.brand }} {{ v.model }} ({{ v.licensePlate }})</option>
          </select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Fecha de inicio</mat-label>
          <input matInput type="date" name="startDate" [(ngModel)]="booking.startDate" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Fecha de fin</mat-label>
          <input matInput type="date" name="endDate" [(ngModel)]="booking.endDate" required />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="loading || !form.valid">Reservar</button>
      </form>
      <div *ngIf="success" class="success">Reserva creada exitosamente.</div>
      <div *ngIf="error" class="error">{{ error }}</div>
    </mat-card>
  `,
  styles: [`
    .booking-create-card {
      max-width: 400px;
      margin: 48px auto 0 auto;
      padding: 32px 24px;
      border-radius: 12px;
    }
    mat-card-title { font-family: 'Montserrat', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    button { margin-top: 16px; }
  `]
})
export class BookingCreateComponent implements OnInit {
  booking: any = { startDate: '', endDate: '' };
  vehicles: Vehicle[] = [];
  loading = false;
  error = '';
  success = false;
  constructor(
    private vehicleService: VehicleService,
    private bookingService: BookingService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.vehicleService.getAvailable().subscribe({
      next: (vehicles) => this.vehicles = vehicles.filter(v => v.isAvailable),
      error: () => this.vehicles = []
    });
    // Si viene de la galería, preseleccionar vehículo
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.booking.vehicleId = +id;
  }
  create() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = false;
    const user = this.auth.getUserFromToken();
    this.booking.clientId = user?.id;
    this.bookingService.create(this.booking).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/reservas']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Error al crear la reserva.';
      }
    });
  }
} 