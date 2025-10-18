import { Component } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../models/login';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../service/global-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
loginReq = new LoginRequest();
  loginRes = new LoginResponse();
  loginForm: FormGroup;
  loginErrorMsg : string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: GlobalService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

doLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginService.login(this.loginForm.value).subscribe({
      next: (data) => {
        Object.assign(this.loginRes, data);
        if (!this.loginRes.errorMessage) {
          localStorage.setItem('token', this.loginRes.accessToken);
          localStorage.setItem('UserDetails', JSON.stringify(this.loginRes.response));
          const userRole = this.loginRes.response?.roles;
          // if (userRole === 'OWNER') {
          //   this.router.navigate(['owner']);
          // } else if (userRole === 'SELLER') {
          //   this.router.navigate(['seller']);
          // } else {
          //   this.router.navigate(['public']);
          // }
          this.router.navigate(['home']);

//          window.location.reload();
        } else {
          this.loginErrorMsg = this.loginRes.errorMessage;
        }
      },
      error: (err) => {
        this.loginErrorMsg = 'Login failed. Please try again.';
      }
    });
  }


  }
