import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap, finalize } from 'rxjs/operators'; 
import { UserRequest } from '../models/user/user-request';
import { AuthService } from '../service/authservvice';
import { ProductService } from '../service/product-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupForm: FormGroup;
  submitted = false;
  successMessage = false;
  userData: UserRequest | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService,
    public productService:ProductService,private router:Router) {
    this.signupForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      mobile: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
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
    return this.signupForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }

    this.userData = this.signupForm.value as UserRequest;
    this.authService.signUp(this.userData).pipe(
      tap((response) => {
        if (response != null) {
          this.successMessage = true;
          this.router.navigateByUrl('login')
        }
      }),
      finalize(() => {
        setTimeout(() => {
          this.signupForm.reset();
          this.submitted = false;
          this.successMessage = false;
          this.userData = null;
        }, 3000);
      })
    ).subscribe({
      error: (err) => {console.error('Error:', err,),console.log('Signup data:', this.userData)}
    });
  }
}
