import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandlerFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { SessionService } from '../session-service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const apiUrl = environment.apiUrl;
  const isYourBackend = req.url.startsWith(apiUrl);
  const authReq = req.clone({ 
    ...(isYourBackend ? { withCredentials: true } : {}),
    headers: req.headers.set('X-XSRF-TOKEN', getCsrfToken())
  });
  
  return next(authReq).pipe(
    tap(()=>{
      sessionService.refreshSession();
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('Session expired - Auto logout');
        logout(router);
      }
      return throwError(() => error);
    })
  );
};

function getCsrfToken(): string {
  return document.cookie.split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1] || '';
}
function logout(router: Router) {
  localStorage.removeItem('user');
  sessionStorage.clear(); // Clear all session data
  router.navigate(['/login'], { replaceUrl: true }); // SPA navigation
}