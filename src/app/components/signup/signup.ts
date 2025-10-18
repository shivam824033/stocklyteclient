import { Component } from '@angular/core';
import { LoginResponse, SignUpRequest } from '../../models/login';
import { FormBuilder, FormGroup, FormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../service/global-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  confirmPassword: string = '';
  loginRes = new LoginResponse();
  signUpRequest = new SignUpRequest();
  roles = ['SELLER', 'PUBLIC'];
  genderList = ['Male', 'Female', 'Other'];
  email: string = '';
  otp: string = '';
  message: string = '';
  otpSent: boolean = false;
  errorMessage: string = '';

  constructor(
    private signUpService: GlobalService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {

    if (this.signUpRequest.password !== this.confirmPassword) {
      this.errorMessage = 'Password and Confirm Password should be same';
      return;
    }

    if (!this.signUpRequest.otp) {
      this.errorMessage = 'Please enter OTP';
      return;
    }

    this.signUpService.signUp(this.signUpRequest).subscribe({
      next: (data) => {
        Object.assign(this.loginRes, data);
        if (!this.loginRes.errorMessage) {
          localStorage.setItem('token', this.loginRes.accessToken);
          localStorage.setItem('UserDetails', JSON.stringify(this.loginRes.response));
          this.router.navigate(['/']);
          window.location.reload();
        } else {
          this.errorMessage = this.loginRes.errorMessage;
        }
      },
      error: (error) => {
        this.errorMessage = 'Signup failed. Please try again.';
      }
    });
  }

  sendOtp(): void {
    if (!this.signUpRequest.email) { 
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.errorMessage = '';
    this.signUpService.sendOtp(this.signUpRequest.email).subscribe({
      next: (res : any) => {
        if (!res.errorMessage) {
          this.message = res.response;
          this.otpSent = true;
          setTimeout(() => {
            this.otpSent = false;
          }, 120000);
        } else {
          this.errorMessage = res.errorMessage;
          this.otpSent = false;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to send OTP';
        this.otpSent = false;
      }
    });
  }

  verifyOtp(): void {
    if (!this.signUpRequest.email) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.signUpService.verifyOtp(this.signUpRequest.email, this.otp).subscribe({
      next: (res :any) => {
        if (!res.errorMessage) {
          this.message = res.response;
          this.otpSent = false;
        } else {
          this.errorMessage = res.errorMessage;
          this.otpSent = true;
        }
      },
      error: () => {
        this.errorMessage = 'OTP verification failed.';
      }
    });
  }
}
