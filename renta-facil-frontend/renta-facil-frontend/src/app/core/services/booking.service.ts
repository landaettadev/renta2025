import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Booking } from '../models/booking.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = environment.apiBooking;

  constructor(private http: HttpClient) {}

  create(booking: Partial<Booking>): Observable<any> {
    return this.http.post(this.apiUrl, booking);
  }

  getHistory(clientId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/history/${clientId}`);
  }

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  cancel(bookingId: number, userId: number) {
    return this.http.post(`${this.apiUrl}/cancel`, { reservaId: bookingId, usuarioId: userId });
  }

  getByVehicle(vehicleId: number) {
    return this.http.get<Booking[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: string) {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  update(booking: any) {
    return this.http.put(`${this.apiUrl}/${booking.id}`, booking);
  }
} 