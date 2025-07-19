import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  type: string;
  isAvailable: boolean;
  image?: string; // base64 o url
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private apiUrl = environment.apiVehicle;
  constructor(private http: HttpClient) {}

  getAvailable(type: string = '', startDate: string = '', endDate: string = ''): Observable<Vehicle[]> {
    // Si no hay filtros, obtener todos
    if (!type && !startDate && !endDate) {
      return this.http.get<Vehicle[]>(this.apiUrl);
    }
    return this.http.get<Vehicle[]>(`${this.apiUrl}/available?type=${type}&startDate=${startDate}&endDate=${endDate}`);
  }

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  register(vehicle: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('brand', vehicle.brand);
    formData.append('model', vehicle.model);
    formData.append('type', vehicle.type);
    formData.append('licensePlate', vehicle.licensePlate);
    formData.append('isAvailable', vehicle.isAvailable);
    if (imageFile) {
      formData.append('imageFile', imageFile, imageFile.name);
    }
    return this.http.post(this.apiUrl, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  update(vehicle: Vehicle): Observable<any> {
    return this.http.put(`${this.apiUrl}/${vehicle.id}`, vehicle);
  }

  getFiltered(type: string = '', startDate: string = '', endDate: string = ''): Observable<Vehicle[]> {
    const tipo = (!type || type === 'Todos') ? '' : type;
    return this.http.get<Vehicle[]>(`${this.apiUrl}/available?type=${tipo}&startDate=${startDate}&endDate=${endDate}`);
  }
} 