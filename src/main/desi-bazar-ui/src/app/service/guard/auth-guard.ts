import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService} from '../authservvice';
import { SessionService } from '../session-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private sessionService:SessionService) {}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
  // ✅ 1. Check JWT cookie FIRST
  const hasJwt = document.cookie.includes('jwt=');
    
  if (!hasJwt) {
    console.warn('No JWT cookie - Redirecting to login');
    this.authService.logout();
    this.router.navigate(['/'], { replaceUrl: true });
    return false;
  }

  // ✅ 2. Check session service
  if (this.sessionService.isSessionActive()) {
    return true; // ✅ Session valid
  }

  // ✅ 3. Session invalid → Logout + redirect
  console.warn('Session expired/invalid - Logging out');
  this.authService.logout();
  this.router.navigate(['/'], { replaceUrl: true });
  return false; // ✅ Block route
  }
}
