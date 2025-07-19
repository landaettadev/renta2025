import { Component } from '@angular/core';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/vehicle.model';
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
  selector: 'app-vehicle-search',
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
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.scss']
})
export class VehicleSearchComponent {
  type = '';
  startDate = '';
  endDate = '';
  vehicles: Vehicle[] = [];
  loading = false;
  searched = false;
  error = '';

  constructor(private vehicleService: VehicleService) {}

  search() {
    this.loading = true;
    this.searched = true;
    this.error = '';
    this.vehicleService.getAvailable(this.type, this.startDate, this.endDate).subscribe({
      next: (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
        this.loading = false;
      },
      error: (err: any) => {
        this.vehicles = [];
        this.error = 'Error al consultar vehículos';
        this.loading = false;
      }
    });
  }
} 