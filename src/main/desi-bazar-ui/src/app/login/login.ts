import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/authservvice';
import { ProductService } from '../service/product-service';
import { tap, finalize } from 'rxjs';
import { SessionService } from '../service/session-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage:string='';

  constructor(private fb: FormBuilder, private authService: AuthService,
    public productService: ProductService,
    private router: Router,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    const payload = this.loginForm.value;
    console.log('Login payload:', payload);
    this.authService.login(payload.email, payload.password).pipe(
      tap((response) => {
        if (response != null) {
          this.router.navigateByUrl('/');
          this.sessionService.initializeAfterLogin();
        }
      }),
      finalize(() => {
        setTimeout(() => {
        }, 3000);
      })
    ).subscribe({
      error: (err) => { 
        this.errorMessage="User not found, please Register...";
        this.cdr.detectChanges();
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 10000);
      }
    });

    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }
}
