import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedInSubject.next(true);
      const user = this.parseJwt(token);
      this.currentUserSubject.next(user);
    }
  }

  loginGoogle() {
    window.location.href = `${this.apiUrl}/google`;
  }

  loginMicrosoft() {
    window.location.href = `${this.apiUrl}/microsoft`;
  }

  handleCallback(token: string) {
    localStorage.setItem('authToken', token);
    const user = this.parseJwt(token);
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    this.router.navigate(['/chat']);
  }

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, name }).pipe(
      tap(res => {
        localStorage.setItem('authToken', res.token);
        this.currentUserSubject.next(res.user);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('authToken', res.token);
        this.currentUserSubject.next(res.user);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
      })
    );
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}
