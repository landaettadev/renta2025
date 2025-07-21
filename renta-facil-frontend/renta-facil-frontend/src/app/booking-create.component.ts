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

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <mat-card class="booking-create-card">
      <mat-card-title>Reservar Vehículo</mat-card-title>
      <div *ngIf="selectedVehicle" class="selected-vehicle-info">
        <img [src]="selectedVehicle.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" alt="Imagen" />
        <div>
          <div class="veh-title">{{ selectedVehicle.brand }} {{ selectedVehicle.model }}</div>
          <div class="veh-plate">Placa: {{ selectedVehicle.licensePlate }}</div>
          <div class="veh-type">Tipo: {{ selectedVehicle.type }}</div>
        </div>
      </div>
      <form (ngSubmit)="create()" #form="ngForm" class="booking-form">
        <mat-form-field appearance="outline" *ngIf="!selectedVehicle">
          <mat-label>Vehículo</mat-label>
          <mat-select name="vehicleId" [(ngModel)]="booking.vehicleId" required (selectionChange)="setVehicle(booking.vehicleId)">
            <mat-option *ngFor="let v of vehicles" [value]="v.id">{{ v.brand }} {{ v.model }} ({{ v.licensePlate }})</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha de inicio</mat-label>
            <input matInput [matDatepicker]="pickerInicio" name="startDate" [(ngModel)]="booking.startDate" required [min]="todayDate" (dateChange)="onInicioChange()" autocomplete="off" [matDatepickerFilter]="dateFilter" />
            <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
            <mat-datepicker #pickerInicio></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Fecha de fin</mat-label>
            <input matInput [matDatepicker]="pickerFin" name="endDate" [(ngModel)]="booking.endDate" required [min]="minDevolucion" autocomplete="off" [matDatepickerFilter]="dateFilter" />
            <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
            <mat-datepicker #pickerFin></mat-datepicker>
            <mat-error *ngIf="booking.endDate && booking.startDate && booking.endDate < booking.startDate">
              La fecha de devolución debe ser posterior a la fecha de inicio.
            </mat-error>
          </mat-form-field>
        </div>
        <button mat-raised-button class="reservar-btn" type="submit" [disabled]="loading || !form.valid">Reservar</button>
        <div *ngIf="overlapWarning" class="error">{{ overlapWarning }}</div>
        <div *ngIf="success" class="success">Reserva creada exitosamente.</div>
        <div *ngIf="error" class="error">{{ error }}</div>
      </form>
      <div class="calendar-separator"></div>
      <div class="calendar-availability-section">
        <div class="calendar-availability-msg">🗓️ Revisa la disponibilidad del artículo</div>
        <mat-calendar [selected]="todayDate" [startAt]="todayDate" [dateClass]="dateClass" [dateFilter]="calendarDateFilter"></mat-calendar>
        <div class="calendar-legend">
          <span class="legend-box occupied"></span> Ocupado
          <span class="legend-box free"></span> Libre
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .booking-create-card {
      max-width: 520px;
      margin: 48px auto 0 auto;
      padding: 36px 28px 32px 28px;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      background: #fff;
    }
    .selected-vehicle-info {
      display: flex;
      align-items: center;
      gap: 28px;
      margin-bottom: 24px;
      background: #fafbfc;
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.09);
    }
    .selected-vehicle-info img {
      width: 140px;
      height: 95px;
      object-fit: cover;
      border-radius: 12px;
      border: 2px solid #eee;
      box-shadow: 0 2px 12px rgba(0,0,0,0.10);
    }
    .veh-title { font-weight: 800; font-size: 1.35rem; color: #222; margin-bottom: 4px; }
    .veh-plate { font-size: 1.08rem; color: #444; margin-bottom: 2px; }
    .veh-type { font-size: 1.05rem; color: #ff9800; font-weight: 600; }
    .booking-form .form-row {
      display: flex;
      gap: 18px;
      margin-bottom: 12px;
    }
    .booking-form mat-form-field {
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
    }
    .reservar-btn:hover:not(:disabled), .reservar-btn:focus:not(:disabled) {
      background: linear-gradient(90deg, #ff5e62 0%, #ff9800 100%);
      transform: scale(1.06);
      box-shadow: 0 8px 32px rgba(255,94,98,0.18), 0 2px 8px rgba(255,152,0,0.12);
    }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    .calendar-separator {
      height: 32px;
    }
    .calendar-availability-section {
      margin-top: 0;
      text-align: center;
      margin-bottom: 32px;
    }
    .calendar-availability-msg {
      font-size: 1.08rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1976d2;
    }
    .calendar-legend {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
      margin-top: 8px;
      font-size: 0.98rem;
    }
    .legend-box {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      margin-right: 4px;
      vertical-align: middle;
    }
    .legend-box.occupied {
      background: #ffeaea;
      border: 1.5px solid #d32f2f;
    }
    .legend-box.free {
      background: #e3fcef;
      border: 1.5px solid #388e3c;
    }
    .calendar-occupied .mat-calendar-body-cell-content {
      background: #ffeaea !important;
      color: #d32f2f !important;
      border-radius: 50%;
      position: relative;
      font-weight: bold;
      text-decoration: line-through;
      box-shadow: 0 0 0 2px #d32f2f33;
    }
    .calendar-strikethrough .mat-calendar-body-cell-content::after {
      content: '';
      position: absolute;
      left: 6px;
      right: 6px;
      top: 50%;
      height: 2px;
      background: #d32f2f;
      transform: translateY(-50%);
      z-index: 2;
      border-radius: 2px;
      pointer-events: none;
    }
    .calendar-availability-section mat-calendar {
      margin: 0 auto;
      display: block;
      max-width: 340px;
      min-width: 260px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      padding: 8px 0 8px 0;
    }
  `]
})
export class BookingCreateComponent implements OnInit {
  booking: any = { startDate: '', endDate: '' };
  vehicles: Vehicle[] = [];
  loading = false;
  error = '';
  success = false;
  selectedVehicle: Vehicle | null = null;
  todayDate: Date = new Date();
  existingBookings: any[] = [];
  overlapWarning: string = '';
  reservedDates: Set<string> = new Set();

  get minDevolucion() {
    return this.booking.startDate ? this.booking.startDate : this.todayDate;
  }

  onInicioChange() {
    if (this.booking.endDate && this.booking.startDate && this.booking.endDate < this.booking.startDate) {
      this.booking.endDate = '';
    }
    this.checkOverlap();
  }

  setVehicle(vehicleId: number) {
    this.booking.vehicleId = vehicleId;
    this.selectedVehicle = this.vehicles.find(v => v.id === vehicleId) || null;
    if (vehicleId) {
      this.loadExistingBookings(vehicleId);
    } else {
      this.existingBookings = [];
    }
    this.checkOverlap();
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
            this.loadExistingBookings(vehicle.id);
          }
        }
        // Leer fechas de query params
        this.route.queryParams.subscribe(params => {
          if (params['startDate']) this.booking.startDate = params['startDate'];
          if (params['endDate']) this.booking.endDate = params['endDate'];
          this.checkOverlap();
        });
      },
      error: () => this.vehicles = []
    });
  }

  loadExistingBookings(vehicleId: number) {
    this.bookingService.getByVehicle(vehicleId).subscribe({
      next: (bookings) => {
        this.existingBookings = bookings;
        // Generar set de fechas reservadas (YYYY-MM-DD)
        this.reservedDates = new Set();
        bookings.forEach(b => {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            this.reservedDates.add(d.toISOString().slice(0, 10));
          }
        });
        this.checkOverlap();
      },
      error: () => {
        this.existingBookings = [];
        this.reservedDates = new Set();
      }
    });
  }

  checkOverlap() {
    this.overlapWarning = '';
    if (!this.booking.startDate || !this.booking.endDate || !this.existingBookings.length) return;
    const start = new Date(this.booking.startDate);
    const end = new Date(this.booking.endDate);
    for (const b of this.existingBookings) {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      if ((start <= bEnd) && (end >= bStart)) {
        this.overlapWarning = '¡El vehículo ya está reservado en el rango seleccionado!';
        break;
      }
    }
  }

  create() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.booking.startDate || !this.booking.endDate) {
      this.error = 'Debes seleccionar una fecha de inicio y una de fin.';
      return;
    }
    this.checkOverlap();
    if (this.overlapWarning) {
      this.error = this.overlapWarning;
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

  // Filtro para bloquear días reservados en el calendario
  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (!d || d < today) return false;
    const iso = d.toISOString().slice(0, 10);
    return !this.reservedDates.has(iso);
  }

  // Filtro para bloquear días pasados y marcar ocupados en el calendario de disponibilidad
  calendarDateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (!d || d < today) return false;
    return true;
  }

  // Función para marcar los días ocupados en el calendario
  dateClass = (d: Date) => {
    const iso = d.toISOString().slice(0, 10);
    if (this.reservedDates.has(iso)) return 'calendar-occupied calendar-strikethrough';
    return '';
  }
} 