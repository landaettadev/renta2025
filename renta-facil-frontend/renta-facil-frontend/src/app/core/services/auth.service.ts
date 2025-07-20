import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  email: string;
  nombre: string;
  role: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'rf_token';
  private userSubject = new BehaviorSubject<any>(this.getUserFromToken());
  user$ = this.userSubject.asObservable();
  private apiUrl = `${environment.apiVehicle.replace('/api/vehicles','')}/api/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiVehicle.replace('/api/vehicles','')}/api/auth/login`, { email, password });
  }

  register(nombre: string, email: string, password: string, celular: string, ciudad: string, direccion: string): Observable<any> {
    return this.http.post(`${environment.apiVehicle.replace('/api/vehicles','')}/api/auth/register`, { nombre, email, password, celular, ciudad, direccion, rol: 'Usuario' });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  setToken(token: string, datosPersonales?: any, clientId?: number, userId?: number) {
    localStorage.setItem(this.tokenKey, token);
    if (datosPersonales || clientId || userId) {
      const datos = {
        celular: datosPersonales?.phone || datosPersonales?.celular || '',
        ciudad: datosPersonales?.ciudad || '',
        direccion: datosPersonales?.direccion || '',
        clientId: clientId ?? null,
        userId: userId ?? null
      };
      localStorage.setItem('rf_user_personal', JSON.stringify(datos));
    }
    this.userSubject.next(this.getUserFromToken());
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = jwtDecode<any>(token);
      const role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      let datosPersonales = { celular: '', ciudad: '', direccion: '', clientId: null, userId: null };
      const stored = localStorage.getItem('rf_user_personal');
      if (stored) {
        try { datosPersonales = JSON.parse(stored); } catch {}
      }
      return {
        id: datosPersonales.userId || payload.sub,
        email: payload.email,
        nombre: payload.nombre,
        role,
        celular: datosPersonales.celular || '',
        ciudad: datosPersonales.ciudad || '',
        direccion: datosPersonales.direccion || '',
        clientId: datosPersonales.clientId || null
      };
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const user = this.getUserFromToken();
    return user?.role || null;
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateClient(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiVehicle.replace('/api/vehicles','')}/api/clients/${id}`, data);
  }

  changePassword(id: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/password`, { currentPassword, newPassword });
  }
} 