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
} 