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

  register(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiVehicle.replace('/api/vehicles','')}/api/auth/register`, { nombre, email, password });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
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
      // Extraer el rol del claim estándar o del claim de Microsoft
      const role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return { id: payload.sub, email: payload.email, nombre: payload.nombre, role };
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
} 