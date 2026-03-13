import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../service/authservvice';
import { Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../service/session-service';

interface UserProfile {
  username: string;
  email: string;
  mobile: number;
}
@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit,OnDestroy  {
  private authService = inject(AuthService);
  private sessionService = inject(SessionService);
  private router = inject(Router);
  private http = inject(HttpClient); // ✅ inject HttpClient
  
  userProfile: UserProfile | null = null; // Fixed: single object, not array
  showProfilePreview = signal(false); // Fixed: false initially
  currentUser = toSignal(this.authService.currentUser$, { initialValue: null });
  sessionStatus = toSignal(this.sessionService.session$, { initialValue: false });
  
  private destroy$ = new Subject<void>(); // ✅ Added

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile() {
    this.http.get<UserProfile>('http://localhost:8080/api/v1/user/profile')
      .pipe(
        takeUntil(this.destroy$),
        tap(response => {
          console.log('Profile loaded:', response);
          this.userProfile = response; // 
          this.authService.setCurrentUser(response);
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Profile error:', err);
          this.authService.logout();
        }
      });
  }

  toggleProfileDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.loadProfile();
    this.showProfilePreview.update(show => !show); 
  }

  logout() {
    this.authService.logout();
    this.showProfilePreview.set(false);
  }

  viewProfile() {
    this.showProfilePreview.set(false);
  }

  editProfile() {
    console.log('Edit profile');
  }
}
