// src/app/services/auth.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRequest } from '../models/user/user-request';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: { id: number; email: string; name: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private router = inject(Router);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.getUserFromToken(token);
      this.currentUserSubject.next(user);
    }
  }
  signUp(userRequest: UserRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/user/register`, userRequest, { responseType: 'text' as 'json' })
      .pipe(tap({
        next: (response) => { alert(`please login now`) },
        error: (err) => {
          const error = JSON.parse(err.error);
          alert(error?.message || 'something went wrong')
        },
      }));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/user/login`, { email, password })
    .pipe(tap({
      next:(response) => {
      console.log(environment.apiUrl);
      if (response != null) {
        console.log(response.token)
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(response.user);
      }},error: (err) => {
        console.log(environment.apiUrl);
        },
    }));
  }
  logout() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/'], { replaceUrl: true });
  }

  isAuthenticated() {
    return this.isAuthenticated$;
  }

  private getUserFromToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { id: payload.sub, email: payload.email };
    } catch {
      return null;
    }
  }
  setCurrentUser(user: any) {
    this.currentUserSubject.next(user); // ✅ Update signal source
  }
}
