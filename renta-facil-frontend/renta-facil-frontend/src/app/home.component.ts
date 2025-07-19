import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { VehicleService, Vehicle } from './core/services/vehicle.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule],
  template: `
    <div class="home-gallery">
      <mat-card class="vehicle-card" *ngFor="let v of vehicles">
        <mat-card-header>
          <mat-card-title>{{ v.brand }} {{ v.model }}</mat-card-title>
          <mat-card-subtitle>{{ v.type }}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image [src]="v.image || 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'" alt="Imagen del vehículo" />
        <mat-card-content>
          <p>Placa: {{ v.licensePlate }}</p>
          <p>Estado: <span [ngClass]="{'disponible': v.isAvailable, 'nodisponible': !v.isAvailable}">{{ v.isAvailable ? 'Disponible' : 'No disponible' }}</span></p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" [routerLink]="['/reservar', v.id]" [disabled]="!v.isAvailable">Reservar</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      margin: 32px 0 64px 0;
    }
    .vehicle-card {
      max-width: 400px;
      margin: 0 auto;
    }
    .disponible { color: #388e3c; font-weight: 600; }
    .nodisponible { color: #d32f2f; font-weight: 600; }
    img[mat-card-image] { object-fit: cover; height: 180px; border-radius: 8px; }
  `]
})
export class HomeComponent implements OnInit {
  vehicles: Vehicle[] = [];
  constructor(private vehicleService: VehicleService) {}
  ngOnInit() {
    this.vehicleService.getAll().subscribe({
      next: (vehicles) => this.vehicles = vehicles,
      error: () => this.vehicles = []
    });
  }
} 