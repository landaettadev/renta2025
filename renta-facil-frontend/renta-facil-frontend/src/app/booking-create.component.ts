import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { BookingService } from './core/services/booking.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule],
  template: `
    <mat-card class="booking-create-card">
      <mat-card-title>Confirmar Reserva</mat-card-title>
      <mat-card-content>
        <div class="booking-grid">
          <div class="booking-img-col">
            <img [src]="selectedVehicle?.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" alt="Imagen" class="veh-img" />
          </div>
          <div class="booking-details-col">
            <div *ngIf="selectedVehicle" class="veh-details">
              <div class="veh-title">{{ selectedVehicle.brand }} {{ selectedVehicle.model }}</div>
              <div class="veh-plate">Placa: {{ selectedVehicle.licensePlate }}</div>
              <div class="veh-type">Tipo: {{ selectedVehicle.type }}</div>
              <div class="veh-price">Precio: <b>{{ selectedVehicle.pricePerDay || 'N/A' }}</b></div>
            </div>
            <form (ngSubmit)="create()" #form="ngForm" class="booking-form-grid">
              <mat-form-field appearance="outline" *ngIf="!selectedVehicle">
                <mat-label>Vehículo</mat-label>
                <mat-select name="vehicleId" [(ngModel)]="booking.vehicleId" required>
                  <mat-option *ngFor="let v of vehicles" [value]="v.id">{{ v.brand }} {{ v.model }} ({{ v.licensePlate }})</mat-option>
                </mat-select>
              </mat-form-field>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Fecha de inicio</mat-label>
                  <input matInput [matDatepicker]="pickerInicio" name="startDate" [(ngModel)]="booking.startDate" required [min]="today" (dateChange)="onInicioChange()" autocomplete="off" />
                  <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
                  <mat-datepicker #pickerInicio></mat-datepicker>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Fecha de fin</mat-label>
                  <input matInput [matDatepicker]="pickerFin" name="endDate" [(ngModel)]="booking.endDate" required [min]="minDevolucion" autocomplete="off" />
                  <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
                  <mat-datepicker #pickerFin></mat-datepicker>
                  <mat-error *ngIf="booking.endDate && booking.startDate && booking.endDate < booking.startDate">
                    La fecha de devolución debe ser posterior a la fecha de inicio.
                  </mat-error>
                </mat-form-field>
              </div>
              <button mat-raised-button color="primary" class="reservar-btn" type="submit" [disabled]="loading || !form.valid">
                <mat-spinner *ngIf="loading" diameter="22"></mat-spinner>
                <span *ngIf="!loading">Confirmar Reserva</span>
              </button>
              <div *ngIf="success" class="success">Reserva creada exitosamente.</div>
              <div *ngIf="error" class="error">{{ error }}</div>
            </form>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .booking-create-card {
      max-width: 700px;
      margin: 48px auto 0 auto;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      background: #fff;
      padding-bottom: 18px;
    }
    .booking-grid {
      display: flex;
      gap: 32px;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .booking-img-col {
      flex: 1 1 220px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .veh-img {
      width: 220px;
      height: 150px;
      object-fit: cover;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.10);
      border: 2px solid #eee;
    }
    .booking-details-col {
      flex: 2 1 320px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .veh-details {
      margin-bottom: 12px;
    }
    .veh-title { font-weight: 800; font-size: 1.35rem; color: #222; margin-bottom: 4px; }
    .veh-plate { font-size: 1.08rem; color: #444; margin-bottom: 2px; }
    .veh-type { font-size: 1.05rem; color: #ff9800; font-weight: 600; }
    .veh-price { font-size: 1.08rem; color: #388e3c; font-weight: 600; margin-bottom: 8px; }
    .booking-form-grid .form-row {
      display: flex;
      gap: 18px;
      margin-bottom: 12px;
    }
    .booking-form-grid mat-form-field {
      flex: 1;
    }
    .reservar-btn {
      display: block;
      margin: 28px auto 0 auto;
      background: linear-gradient(90deg, #ff9800 0%, #ff5e62 100%);
      color: #fff;
      font-weight: 700;
      font-size: 1.1rem;
      border-radius: 24px;
      padding: 14px 48px;
      box-shadow: 0 4px 16px rgba(255,152,0,0.10), 0 1.5px 6px rgba(255,94,98,0.10);
      transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
      min-width: 220px;
      min-height: 48px;
      position: relative;
    }
    .reservar-btn mat-spinner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .reservar-btn:hover:not(:disabled), .reservar-btn:focus:not(:disabled) {
      background: linear-gradient(90deg, #ff5e62 0%, #ff9800 100%);
      transform: scale(1.06);
      box-shadow: 0 8px 32px rgba(255,94,98,0.18), 0 2px 8px rgba(255,152,0,0.12);
    }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
  `]
})
export class BookingCreateComponent implements OnInit {
  booking: any = { startDate: '', endDate: '' };
  vehicles: Vehicle[] = [];
  loading = false;
  error = '';
  success = false;
  selectedVehicle: Vehicle | null = null;
  today = new Date().toISOString().slice(0, 10);

  get minDevolucion() {
    return this.booking.startDate ? this.booking.startDate : this.today;
  }

  onInicioChange() {
    if (this.booking.endDate && this.booking.startDate && this.booking.endDate < this.booking.startDate) {
      this.booking.endDate = '';
    }
  }

  constructor(
    private vehicleService: VehicleService,
    private bookingService: BookingService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.vehicleService.getAvailable().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles.filter(v => v.isAvailable);
        // Si viene de la galería, preseleccionar vehículo
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          const vehicle = this.vehicles.find(v => v.id === +id);
          if (vehicle) {
            this.selectedVehicle = vehicle;
            this.booking.vehicleId = vehicle.id;
          }
        }
      },
      error: () => this.vehicles = []
    });
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
    const bookingToSend = {
      vehicleId: this.booking.vehicleId,
      clientId: user?.id,
      startDate: this.booking.startDate,
      endDate: this.booking.endDate
    };
    this.bookingService.create(bookingToSend).subscribe({
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