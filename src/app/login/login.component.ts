import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostaskService } from '../service/hostask.service';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  loginUserId: number = 0;
  loginUserType: number = 0;
  message: string = '';
  idDict:any;

  constructor(private fb: FormBuilder, private authService: HostaskService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Submit the login form
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true; // Disable the form during submission
    this.errorMessage = ''; // Reset error message

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log('Login successful:', response);

        // Assuming the response contains user type and ID
        this.loginUserId = response.userId;
        this.loginUserType = response.user;

        // Navigate based on user type
        this.idDict = { loginUserID: this.loginUserId, loginUserType: this.loginUserType };
        const encodedData = encodeURIComponent(JSON.stringify(this.idDict));

        if (this.loginUserType === 1) {
          this.router.navigate(['/doctor-add'], { queryParams: { data: encodedData } });
        } else if (this.loginUserType === 2) {
          this.router.navigate(['/home'], { queryParams: { data: encodedData } });
        } else {
          this.errorMessage = 'Unknown user type.';
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.message = 'Check login credentials and try again';
      },
      () => {
        this.isSubmitting = false; // Re-enable the form after submission
      }
    );
  }
}

