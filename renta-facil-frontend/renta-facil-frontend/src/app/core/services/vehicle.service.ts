import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Vehicle } from '../models/vehicle.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private apiUrl = environment.apiVehicle;

  constructor(private http: HttpClient) {}

  getAvailable(type: string, startDate: string, endDate: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/available`, {
      params: { type, startDate, endDate }
    });
  }

  register(vehicle: Vehicle): Observable<any> {
    return this.http.post(this.apiUrl, vehicle);
  }
} 