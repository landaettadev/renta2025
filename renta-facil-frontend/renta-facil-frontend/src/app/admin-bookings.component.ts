import { Component, OnInit } from '@angular/core';
import { BookingService } from './core/services/booking.service';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { Booking } from './core/models/booking.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    DatePipe,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="admin-bookings-wrapper">
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
          <div>
            <b>Fechas:</b>
            <ng-container *ngIf="editId === b.id; else viewDates">
              <mat-form-field appearance="outline">
                <mat-label>Fecha de inicio</mat-label>
                <input matInput [matDatepicker]="pickerInicio" [(ngModel)]="editBooking.startDate" name="editStartDate" required [min]="today" [matDatepickerFilter]="dateFilter" />
                <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
                <mat-datepicker #pickerInicio></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Fecha de fin</mat-label>
                <input matInput [matDatepicker]="pickerFin" [(ngModel)]="editBooking.endDate" name="editEndDate" required [min]="editBooking.startDate || today" [disabled]="!editBooking.startDate" [matDatepickerFilter]="dateFilter" />
                <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
                <mat-datepicker #pickerFin></mat-datepicker>
              </mat-form-field>
            </ng-container>
            <ng-template #viewDates>
              {{ b.startDate | date }} - {{ b.endDate | date }}
            </ng-template>
          </div>
          <div>
            <b>Estado:</b>
            <ng-container *ngIf="editId === b.id; else viewStatus">
              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <mat-select [(ngModel)]="editBooking.status" name="editStatus" required>
                  <mat-option value="Pending">Pendiente</mat-option>
                  <mat-option value="Confirmed">Confirmada</mat-option>
                  <mat-option value="Completed">Completada</mat-option>
                  <mat-option value="Cancelled">Cancelada</mat-option>
                </mat-select>
              </mat-form-field>
            </ng-container>
            <ng-template #viewStatus>
              {{ b.status || 'Pendiente' }}
            </ng-template>
          </div>
          <ng-container *ngIf="editId === b.id; else editDeleteBtns">
            <button mat-button color="primary" (click)="saveEdit()" [disabled]="!editBooking.startDate || !editBooking.endDate || editBooking.endDate < editBooking.startDate || !editBooking.status">Guardar</button>
            <button mat-button (click)="cancelEdit()">Cancelar</button>
          </ng-container>
          <ng-template #editDeleteBtns>
            <button mat-icon-button color="primary" (click)="startEdit(b)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="deleteBooking(b.id)"><mat-icon>delete</mat-icon></button>
          </ng-template>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-bookings-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: 32px 0 48px 0;
      background: #f5f7fa;
    }
    .admin-bookings-card {
      max-width: 700px;
      width: 100%;
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
  editId: number | null = null;
  editBooking: any = {};
  today = new Date();

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

  deleteBooking(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta reserva?')) {
      this.bookingService.delete(id).subscribe(() => this.ngOnInit());
    }
  }

  updateStatus(booking: Booking, newStatus: string) {
    this.bookingService.updateStatus(booking.id, newStatus).subscribe(() => {
      booking.status = newStatus;
    });
  }

  startEdit(b: any) {
    this.editId = b.id;
    this.editBooking = { ...b };
    if (!this.editBooking.status) this.editBooking.status = 'Pending';
  }

  cancelEdit() {
    this.editId = null;
    this.editBooking = {};
  }

  saveEdit() {
    if (!this.editBooking.startDate || !this.editBooking.endDate || this.editBooking.endDate < this.editBooking.startDate) return;
    this.bookingService.update(this.editBooking).subscribe(() => {
      this.editId = null;
      this.editBooking = {};
      this.ngOnInit();
    });
  }

  // Permitir solo fechas desde hoy en adelante
  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return !d || d >= today;
  }
} 