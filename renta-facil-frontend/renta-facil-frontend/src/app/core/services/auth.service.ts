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
      const payload = jwtDecode<JwtPayload>(token);
      return { id: payload.sub, email: payload.email, nombre: payload.nombre, rol: payload.role };
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const user = this.getUserFromToken();
    return user?.rol || null;
  }
} 