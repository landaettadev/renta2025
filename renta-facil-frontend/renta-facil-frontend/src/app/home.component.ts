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
          <div class="reservar-btn-container">
            <button mat-raised-button class="reservar-btn" [routerLink]="['/reservar', v.id]" [disabled]="!v.isAvailable">
              <span>Reservar</span>
            </button>
          </div>
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
      justify-items: center;
    }
    .vehicle-card {
      width: 320px;
      height: 370px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition:
        transform 0.25s cubic-bezier(.4,2,.6,1),
        box-shadow 0.25s cubic-bezier(.4,2,.6,1),
        filter 0.25s;
      background: #fff;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
    }
    .vehicle-card img[mat-card-image] {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 8px 8px 0 0;
    }
    .vehicle-card:hover {
      transform: scale(1.06) translateY(-8px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      z-index: 2;
      filter: brightness(1.05);
    }
    .vehicle-card:not(:hover) {
      filter: brightness(0.95) blur(0.5px);
      transition: filter 0.25s;
    }
    .reservar-btn-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-top: 8px;
    }
    .reservar-btn {
      background: linear-gradient(90deg, #ff9800 0%, #ff5e62 100%);
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 1.08rem;
      border: none;
      border-radius: 24px;
      padding: 10px 32px;
      box-shadow: 0 4px 16px rgba(255,152,0,0.10), 0 1.5px 6px rgba(255,94,98,0.10);
      transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s, background 0.18s;
      letter-spacing: 0.5px;
      outline: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      z-index: 1;
    }
    .reservar-btn:disabled {
      background: #e0e0e0;
      color: #bdbdbd;
      cursor: not-allowed;
      box-shadow: none;
    }
    .reservar-btn:hover:not(:disabled), .reservar-btn:focus:not(:disabled) {
      background: linear-gradient(90deg, #ff5e62 0%, #ff9800 100%);
      transform: scale(1.08);
      box-shadow: 0 8px 32px rgba(255,94,98,0.18), 0 2px 8px rgba(255,152,0,0.12);
    }
    .disponible { color: #388e3c; font-weight: 600; }
    .nodisponible { color: #d32f2f; font-weight: 600; }
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