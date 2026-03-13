import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './authservvice';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  private sessionSubject = new BehaviorSubject<boolean>(false);
  public session$ = this.sessionSubject.asObservable();
  currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  private readonly IDLE_TIMEOUT = 5 * 60 * 1000;
  private readonly SESSION_TIMEOUT = 9 * 60 * 1000;
  private sessionTimer: any;
  private idleTimer: any;
  private lastActivity = Date.now();

  constructor() {
    this.setupIdleTimeout();
    this.checkSessionOnInit();
  }
  private setupIdleTimeout() {
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'touchmove'].forEach(event => {
      document.addEventListener(event, () => {
        this.lastActivity = Date.now();
        this.refreshSession();
      }, { passive: true });
    });
  }

  private checkSessionOnInit() {
    const hasJwt = this.hasJwtCookie();
    this.sessionSubject.next(hasJwt);

    if (hasJwt) {
      this.startSessionTimer();
    }
  }
  private startSessionTimer() {
    this.clearSessionTimer();
    this.sessionTimer = setTimeout(() => {
      console.warn('Session expired - Auto logout');
      this.checkIdleAndLogout();
    }, this.SESSION_TIMEOUT);
  }
  private checkIdleAndLogout() {
    const now = Date.now();
    const idleTime = now - this.lastActivity;
    console.log(idleTime);
    if (idleTime > this.IDLE_TIMEOUT) {
      this.authService.logout();
    } else if (idleTime > this.SESSION_TIMEOUT) {
      this.authService.logout();
    } else {
      this.startSessionTimer();
    }
  }

  private clearSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  // ✅ Check JWT cookie existence
  private hasJwtCookie(): boolean {
    return document.cookie.includes('jwt=');
  }

  // ✅ Refresh session (extend timer)
  refreshSession() {
    if (this.sessionSubject.value) {
      this.startSessionTimer();
    }
  }

  // ✅ Get current session state
  isSessionActive(): boolean {
    return this.sessionSubject.value;
  }
  initializeAfterLogin() {
    this.sessionSubject.next(true);
    this.startSessionTimer();
  }
}
