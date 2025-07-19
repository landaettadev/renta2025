import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule],
  template: `
    <mat-card class="admin-vehicle-card">
      <mat-card-title>Gestión de Vehículos</mat-card-title>
      <div class="actions-row">
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Agregar Vehículo
        </button>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Filtrar</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Buscar..." />
        </mat-form-field>
      </div>
      <div class="table-container">
        <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let v">
              <img [src]="v.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" class="list-img" />
            </td>
          </ng-container>
          <ng-container matColumnDef="brand">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Marca</th>
            <td mat-cell *matCellDef="let v">{{ v.brand }}</td>
          </ng-container>
          <ng-container matColumnDef="model">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Modelo</th>
            <td mat-cell *matCellDef="let v">{{ v.model }}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Tipo</th>
            <td mat-cell *matCellDef="let v">{{ v.type }}</td>
          </ng-container>
          <ng-container matColumnDef="licensePlate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Placa</th>
            <td mat-cell *matCellDef="let v">{{ v.licensePlate }}</td>
          </ng-container>
          <ng-container matColumnDef="isAvailable">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Disponibilidad</th>
            <td mat-cell *matCellDef="let v">
              <span class="badge" [ngClass]="{'disponible': v.isAvailable, 'nodisponible': !v.isAvailable}">
                {{ v.isAvailable ? 'Disponible' : 'No disponible' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let v">
              <button mat-icon-button color="primary" (click)="openDialog(v)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteVehicle(v)"><mat-icon>delete_forever</mat-icon></button>
              <button mat-icon-button [color]="v.isAvailable ? 'primary' : 'warn'" (click)="toggleDisponibilidad(v)">
                <mat-icon>{{ v.isAvailable ? 'toggle_on' : 'toggle_off' }}</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [pageSize]="8" [pageSizeOptions]="[8, 16, 32]"></mat-paginator>
      </div>
    </mat-card>
    <ng-template #dialogTemplate let-data>
      <form (ngSubmit)="saveVehicle()" #form="ngForm" class="vehicle-form-modal">
        <mat-form-field appearance="outline">
          <mat-label>Marca</mat-label>
          <input matInput name="brand" [(ngModel)]="editVehicle.brand" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Modelo</mat-label>
          <input matInput name="model" [(ngModel)]="editVehicle.model" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select name="type" [(ngModel)]="editVehicle.type" required>
            <mat-option value="Sedan">Sedan</mat-option>
            <mat-option value="SUV">SUV</mat-option>
            <mat-option value="Hatchback">Hatchback</mat-option>
            <mat-option value="Pickup">Pickup</mat-option>
            <mat-option value="Otro">Otro</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Placa</mat-label>
          <input matInput name="licensePlate" [(ngModel)]="editVehicle.licensePlate" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Disponibilidad</mat-label>
          <mat-select name="isAvailable" [(ngModel)]="editVehicle.isAvailable" required>
            <mat-option [value]="true">Disponible</mat-option>
            <mat-option [value]="false">No disponible</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="image-upload">
          <label>Imagen:</label>
          <input type="file" (change)="onFileChange($event, true)" accept="image/*" />
          <img *ngIf="editVehicle.image" [src]="editVehicle.image" alt="Preview" class="preview-img" />
        </div>
        <button mat-raised-button color="primary" type="submit" [disabled]="loading || !form.valid">
          <mat-icon>save</mat-icon> Guardar
        </button>
        <button mat-button type="button" (click)="closeDialog()">Cancelar</button>
      </form>
    </ng-template>
  `,
  styles: [`
    .admin-vehicle-card {
      max-width: 700px;
      margin: 32px auto 24px auto;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      padding: 32px 24px 24px 24px;
      background: #fff;
    }
    .actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .filter-field {
      flex: 1;
      margin-left: 24px;
    }
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }
    th, td {
      padding: 12px 18px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background-color: #fafbfc;
      font-weight: 600;
      color: #333;
      font-size: 0.95rem;
    }
    td {
      color: #555;
      font-size: 0.9rem;
    }
    .list-img {
      width: 80px;
      height: 54px;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 18px;
      border: 1.5px solid #eee;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .vehicle-form-modal .form-row {
      display: flex;
      gap: 24px;
      margin-bottom: 12px;
    }
    .vehicle-form-modal mat-form-field {
      flex: 1;
    }
    .image-upload {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 16px;
    }
    .preview-img {
      width: 100px;
      height: 70px;
      object-fit: cover;
      border-radius: 8px;
      margin-top: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      border: 1.5px solid #eee;
    }
    .agregar-btn {
      display: block;
      margin: 24px auto 0 auto;
      background: linear-gradient(90deg, #ff9800 0%, #ff5e62 100%);
      color: #fff;
      font-weight: 700;
      font-size: 1.1rem;
      border-radius: 24px;
      padding: 12px 40px;
      box-shadow: 0 4px 16px rgba(255,152,0,0.10), 0 1.5px 6px rgba(255,94,98,0.10);
      transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
    }
    .agregar-btn:hover:not(:disabled), .agregar-btn:focus:not(:disabled) {
      background: linear-gradient(90deg, #ff5e62 0%, #ff9800 100%);
      transform: scale(1.06);
      box-shadow: 0 8px 32px rgba(255,94,98,0.18), 0 2px 8px rgba(255,152,0,0.12);
    }
    .vehicle-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin: 24px 0;
    }
    .vehicle-list-card {
      display: flex;
      align-items: center;
      background: #fafbfc;
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      padding: 12px 18px;
      transition: box-shadow 0.18s, transform 0.18s;
    }
    .vehicle-list-card:hover {
      box-shadow: 0 8px 32px rgba(255,152,0,0.13), 0 2px 8px rgba(255,94,98,0.10);
      transform: scale(1.02);
    }
    .list-img {
      width: 80px;
      height: 54px;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 18px;
      border: 1.5px solid #eee;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .vehicle-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .vehicle-title {
      font-weight: 700;
      font-size: 1.1rem;
      color: #333;
    }
    .vehicle-type {
      font-weight: 400;
      color: #888;
      font-size: 0.98rem;
    }
    .vehicle-plate {
      font-size: 0.98rem;
      color: #666;
    }
    .badge {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      margin-top: 4px;
    }
    .disponible {
      background: #e8f5e9;
      color: #388e3c;
    }
    .nodisponible {
      background: #ffebee;
      color: #d32f2f;
    }
    .vehicle-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-left: 18px;
    }
    .vehicle-actions button {
      border-radius: 50%;
      transition: box-shadow 0.18s, background 0.18s;
    }
    .vehicle-actions button:hover {
      box-shadow: 0 2px 8px rgba(255,152,0,0.13);
      background: #fff3e0;
    }
    .success { color: #388e3c; margin-top: 16px; font-weight: 600; }
    .error { color: #d32f2f; margin-top: 16px; font-weight: 600; }
    .switch-btn {
      transition: background 0.18s, box-shadow 0.18s;
    }
    .switch-btn .mat-icon {
      font-size: 2.2rem;
      transition: color 0.18s;
    }
  `]
})
export class AdminVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  dataSource = new MatTableDataSource<Vehicle>([]);
  displayedColumns: string[] = ['image', 'brand', 'model', 'type', 'licensePlate', 'isAvailable', 'actions'];
  loading = false;
  error = '';
  success = false;
  imageFile: File | null = null;
  editVehicle: Partial<Vehicle> = { isAvailable: true };
  dialogRef: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogTemplate') dialogTemplate: any;

  constructor(private vehicleService: VehicleService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadVehicles();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadVehicles() {
    this.vehicleService.getAll().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.dataSource.data = vehicles;
      },
      error: () => {
        this.vehicles = [];
        this.dataSource.data = [];
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(vehicle?: Vehicle) {
    this.editVehicle = vehicle ? { ...vehicle } : { isAvailable: true };
    this.dialogRef = this.dialog.open(this.dialogTemplate, { width: '420px' });
  }
  closeDialog() {
    if (this.dialogRef) this.dialogRef.close();
  }
  saveVehicle() {
    this.loading = true;
    if (this.editVehicle.id) {
      this.vehicleService.update(this.editVehicle as Vehicle).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.snackBar.open('Vehículo actualizado', 'Cerrar', { duration: 2000 });
          this.closeDialog();
          this.loadVehicles();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al actualizar vehículo.';
        }
      });
    } else {
      this.vehicleService.register(this.editVehicle, this.imageFile || undefined).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.snackBar.open('Vehículo agregado', 'Cerrar', { duration: 2000 });
          this.closeDialog();
          this.loadVehicles();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al registrar vehículo.';
        }
      });
    }
  }
  onFileChange(event: any, isEdit = false) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (isEdit) {
          this.editVehicle.image = e.target.result;
        } else {
          // deprecated, solo para compatibilidad
        }
      };
      reader.readAsDataURL(file);
    }
  }
  toggleDisponibilidad(v: Vehicle) {
    const updated = { ...v, isAvailable: !v.isAvailable };
    this.vehicleService.update(updated).subscribe({
      next: () => {
        this.snackBar.open('Disponibilidad actualizada', 'Cerrar', { duration: 2000 });
        this.loadVehicles();
      },
      error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 2000 })
    });
  }
  deleteVehicle(v: Vehicle) {
    if (confirm('¿Seguro que deseas eliminar este vehículo?')) {
      this.vehicleService.delete(v.id).subscribe({
        next: () => {
          this.snackBar.open('Vehículo eliminado', 'Cerrar', { duration: 2000 });
          this.loadVehicles();
        },
        error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 2000 })
      });
    }
  }
} 