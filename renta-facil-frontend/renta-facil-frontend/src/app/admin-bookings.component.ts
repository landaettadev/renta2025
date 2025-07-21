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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from './core/services/auth.service';

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
    MatNativeDateModule,
    MatChipsModule
  ],
  template: `
    <div class="admin-bookings-wrapper">
      <mat-card class="admin-bookings-card">
        <mat-card-title>Gestión de Reservas</mat-card-title>
        <div class="admin-bookings-filters">
          <form class="bookings-filter-form" autocomplete="off" (ngSubmit)="$event.preventDefault()">
            <mat-form-field appearance="outline">
              <mat-label>Fecha inicio</mat-label>
              <input matInput [matDatepicker]="pickerInicioFiltro" [(ngModel)]="filterStartDate" name="filterStartDate" autocomplete="off" [matDatepickerFilter]="dateFilter" />
              <mat-datepicker-toggle matSuffix [for]="pickerInicioFiltro"></mat-datepicker-toggle>
              <mat-datepicker #pickerInicioFiltro></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Fecha fin</mat-label>
              <input matInput [matDatepicker]="pickerFinFiltro" [(ngModel)]="filterEndDate" name="filterEndDate" autocomplete="off" [min]="filterStartDate || today" [matDatepickerFilter]="dateFilterFin" />
              <mat-datepicker-toggle matSuffix [for]="pickerFinFiltro"></mat-datepicker-toggle>
              <mat-datepicker #pickerFinFiltro></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Nombre usuario</mat-label>
              <input matInput [(ngModel)]="filterUserName" name="filterUserName" placeholder="Buscar por nombre" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Correo usuario</mat-label>
              <input matInput [(ngModel)]="filterUserEmail" name="filterUserEmail" placeholder="Buscar por correo" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Placa vehículo</mat-label>
              <input matInput [(ngModel)]="filterPlate" name="filterPlate" placeholder="Buscar por placa" />
            </mat-form-field>
            <button mat-stroked-button type="button" (click)="filterStartDate=null;filterEndDate=null;filterUserName='';filterUserEmail='';filterPlate=''">Limpiar</button>
            <button mat-raised-button color="primary" type="button" class="buscar-btn">Buscar</button>
          </form>
        </div>
        <div *ngIf="filteredBookings.length === 0" class="empty">No hay reservas registradas.</div>
        <div *ngFor="let b of pagedFilteredBookings" class="booking-item">
          <div class="client-info">
            <mat-icon class="client-icon">person</mat-icon>
            <span class="client-name"><b>{{ b.client?.nombre || b.client?.Nombre || b.clientId }}</b></span>
            <span class="client-email" *ngIf="b.client?.email || b.client?.Email">({{ b.client?.email || b.client?.Email }})</span>
          </div>
          <div class="vehicle-info-compact">
            <img [src]="b.vehicle?.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" class="vehicle-img-thumb" alt="Vehículo" />
            <mat-icon class="vehicle-icon">directions_car</mat-icon>
            <span class="vehicle-main"><b>{{ b.vehicle?.brand }} {{ b.vehicle?.model }}</b></span>
            <span class="vehicle-plate" *ngIf="b.vehicle?.licensePlate">- Placa: {{ b.vehicle?.licensePlate }}</span>
            <span class="vehicle-type" *ngIf="b.vehicle?.type">({{ b.vehicle?.type }})</span>
          </div>
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
              <mat-chip [ngClass]="statusChipClass(b.status)">
                {{ getStatusLabel(b.status) }}
              </mat-chip>
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
      <div class="pagination">
        <button mat-stroked-button (click)="goToPage(currentPage-1)" [disabled]="currentPage === 1">Anterior</button>
        <span>Página {{currentPage}} de {{totalPages}}</span>
        <button mat-stroked-button (click)="goToPage(currentPage+1)" [disabled]="currentPage === totalPages">Siguiente</button>
      </div>
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
    .admin-bookings-filters {
      margin-bottom: 18px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      padding: 12px 18px 6px 18px;
      margin-top: 8px;
    }
    .bookings-filter-form {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .bookings-filter-form mat-form-field {
      min-width: 140px;
      flex: 1;
    }
    .bookings-filter-form button {
      margin-bottom: 4px;
      border-radius: 24px;
      padding: 8px 22px;
      font-weight: 600;
      font-size: 1.01rem;
      color: #ff9800;
      border-color: #ff9800;
      transition: border 0.18s, color 0.18s;
    }
    .bookings-filter-form button:hover {
      color: #ff5e62;
      border-color: #ff5e62;
    }
    .buscar-btn {
      background: linear-gradient(90deg, #ff9800 0%, #ff5e62 100%);
      color: #fff !important;
      font-weight: 700;
      font-size: 1.05rem;
      border-radius: 24px;
      padding: 8px 22px;
      box-shadow: 0 4px 16px rgba(255,152,0,0.10), 0 1.5px 6px rgba(255,94,98,0.10);
      margin-left: 8px;
    }
    .buscar-btn:hover:not(:disabled), .buscar-btn:focus:not(:disabled) {
      background: linear-gradient(90deg, #ff5e62 0%, #ff9800 100%);
      color: #fff !important;
      transform: scale(1.06);
      box-shadow: 0 8px 32px rgba(255,94,98,0.18), 0 2px 8px rgba(255,152,0,0.12);
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
    .client-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      font-size: 1.05rem;
    }
    .client-icon { color: #1976d2; font-size: 1.2rem; }
    .client-name { font-weight: 700; }
    .client-email { color: #888; font-size: 0.98rem; margin-left: 4px; }
    .vehicle-info-compact {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.05rem;
      margin-bottom: 4px;
    }
    .vehicle-img-thumb {
      width: 54px;
      height: 36px;
      object-fit: cover;
      border-radius: 6px;
      margin-right: 8px;
      border: 1.5px solid #eee;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    }
    .vehicle-icon { color: #ff9800; font-size: 1.2rem; }
    .vehicle-main { font-weight: 700; }
    .vehicle-plate { color: #555; font-size: 0.98rem; margin-left: 4px; }
    .vehicle-type { color: #888; font-size: 0.98rem; margin-left: 4px; }
    .empty { color: #888; margin: 24px 0; text-align: center; }
    .chip-pendiente { background: #fff3cd !important; color: #b8860b !important; font-weight: 600; }
    .chip-confirmada { background: #e3fcef !important; color: #388e3c !important; font-weight: 600; }
    .chip-cancelada { background: #ffeaea !important; color: #d32f2f !important; font-weight: 600; }
    .chip-completada { background: #e3e9fc !important; color: #1976d2 !important; font-weight: 600; }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
      margin: 18px 0 0 0;
    }
  `]
})
export class AdminBookingsComponent implements OnInit {
  bookings: Array<Booking & { vehicle?: Vehicle; client?: any }> = [];
  editId: number | null = null;
  editBooking: any = {};
  today = new Date();
  clients: any[] = [];
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterUserName: string = '';
  filterUserEmail: string = '';
  filterPlate: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private bookingService: BookingService,
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.bookingService.getAll().subscribe({
      next: (bookings) => {
        this.vehicleService.getAll().subscribe({
          next: (vehicles) => {
            this.authService.getAllUsers().subscribe({
              next: (clients) => {
                this.clients = clients;
                this.bookings = bookings.map(b => ({
                  ...b,
                  vehicle: vehicles.find(v => v.id === b.vehicleId),
                  client: clients.find(c => c.id === b.clientId)
                }));
              },
              error: () => {
                this.bookings = bookings.map(b => ({
                  ...b,
                  vehicle: vehicles.find(v => v.id === b.vehicleId)
                }));
              }
            });
          },
          error: () => {
            this.bookings = bookings;
          }
        });
      },
      error: () => this.bookings = []
    });
  }

  async deleteBooking(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar reserva',
        message: '¿Estás seguro de que deseas eliminar esta reserva?'
      }
    });
    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
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
  dateFilterFin = (d: Date | null): boolean => {
    const min = this.filterStartDate ? new Date(this.filterStartDate) : new Date();
    min.setHours(0,0,0,0);
    return !d || d >= min;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Pending': return 'Pendiente';
      case 'Confirmed': return 'Confirmada';
      case 'Cancelled': return 'Cancelada';
      case 'Completed': return 'Completada';
      default: return status || 'Pendiente';
    }
  }
  statusChipClass(status: string): string {
    switch (status) {
      case 'Pending': return 'chip-pendiente';
      case 'Confirmed': return 'chip-confirmada';
      case 'Cancelled': return 'chip-cancelada';
      case 'Completed': return 'chip-completada';
      default: return 'chip-pendiente';
    }
  }

  get filteredBookings() {
    return this.bookings.filter(b => {
      // Filtrar por fechas
      let dateOk = true;
      if (this.filterStartDate) {
        dateOk = new Date(b.startDate) >= new Date(this.filterStartDate!);
      }
      if (dateOk && this.filterEndDate) {
        dateOk = new Date(b.endDate) <= new Date(this.filterEndDate!);
      }
      // Filtrar por nombre de usuario
      let nameOk = true;
      if (this.filterUserName.trim()) {
        const name = (b.client?.nombre || b.client?.Nombre || '').toLowerCase();
        nameOk = name.includes(this.filterUserName.trim().toLowerCase());
      }
      // Filtrar por correo
      let emailOk = true;
      if (this.filterUserEmail.trim()) {
        const email = (b.client?.email || b.client?.Email || '').toLowerCase();
        emailOk = email.includes(this.filterUserEmail.trim().toLowerCase());
      }
      // Filtrar por placa
      let plateOk = true;
      if (this.filterPlate.trim()) {
        const plate = (b.vehicle?.licensePlate || '').toLowerCase();
        plateOk = plate.includes(this.filterPlate.trim().toLowerCase());
      }
      return dateOk && nameOk && emailOk && plateOk;
    });
  }

  get pagedFilteredBookings() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBookings.slice(start, start + this.pageSize);
  }
  get totalPages() {
    return Math.ceil(this.filteredBookings.length / this.pageSize) || 1;
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
} 