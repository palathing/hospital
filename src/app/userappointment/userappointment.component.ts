import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HostaskService } from '../service/hostask.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userappointment',
  standalone: false,
  
  templateUrl: './userappointment.component.html',
  styleUrl: './userappointment.component.css'
})
export class UserappointmentComponent  implements OnInit {
  registerForm!: FormGroup;
  loading = false;

  states: Array<{ id: number; name: string }> = [];
  cities: Array<{ id: number; name: string }> = [];
  
  users: any[] = []; // Array to store the list of users

  submittedData: any = null;  // Store the submitted form data
  userProfile: any = {};  // Store the user profile

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private hostaskService: HostaskService // Custom service for backend communication
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
      gender: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      terms_and_conditions: [false, Validators.requiredTrue],
    });

    // Fetch states and users initially
    this.fetchStates();
    this.fetchUsers();
  }

  // Fetch users to populate the list
  fetchUsers(): void {
    this.hostaskService.getUsers().subscribe({
      next: (data) => {
        console.log('Fetched users:', data);  // Log the data being fetched

        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }
  

  ngOnInit(): void {
    // Initialize the form
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        ],
      ],
      confirm_password: ['', Validators.required],
      gender: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      terms_and_conditions: [false, Validators.requiredTrue],
    });

    this.registerForm.get('confirm_password')?.setValidators([
      Validators.required,
      this.matchPasswords.bind(this),
    ]);

    

    // Fetch states from backend
    this.fetchStates();
    this.fetchUsers();

  }

  // Fetch states from the backend
  fetchStates(): void {
    this.hostaskService.getStates().subscribe({
      next: (data) => {
        this.states = data;
      },
      error: (error) => {
        console.error('Error fetching states:', error);
      },
    });
  }

  // Fetch cities based on state selection
  fetchCities(stateId: number): void {
    this.hostaskService.getCities(stateId).subscribe({
      next: (data) => {
        this.cities = data;
        // Reset the city selection if state changes
        this.registerForm.get('city')?.setValue('');
      },
      error: (error) => {
        console.error('Error fetching cities:', error);
      },
    });
  }

  // Custom validator: Match passwords
  private matchPasswords(control: any) {
    if (this.registerForm) {
      const password = this.registerForm.get('password')?.value;
      return password === control.value ? null : { passwordMismatch: true };
    }
    return null;
  }

  // Handle state change event
  onStateChange(event: any): void {
    const selectedStateId = event.target.value;
    if (selectedStateId) {
      this.fetchCities(+selectedStateId); // Ensure stateId is passed as a number
    }
  }

  // Handle form submission
  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid:', this.registerForm.errors);  // Log form validation errors

      return;
    }

    const email = this.registerForm.get('email')?.value;
    

    this.loading = true;

    const formData = this.registerForm.value;
    console.log('Form data being sent:', formData);
    
    // Convert gender to lowercase before sending it to the backend
  const payload = {
    ...this.registerForm.value,
    gender: formData.gender.toLowerCase(),  // Ensure gender is lowercase
  };

  console.log('Form data being sent:', payload);  // Log the form data


    this.hostaskService.createUser(payload).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.loading = false;
        this.submittedData = formData;  // Store the form data to display in the table
        this.submittedData = payload;  // Store the form data to display in the table
        this.fetchUsers(); // Refresh the list of users after successful registration

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error during registration:', error);
        this.loading = false;

        if (error.error) {
          console.error('Backend Error:', error.error); // Log the backend error
        }else {
          console.error('Backend Error:', error.error); // Log any other errors
        }
      },
    });
  }

  // Getter for easier access to form controls in the template
  get f() {
    return this.registerForm.controls;
  }

  

  navigateToAnotherComponent(): void {
    // Here you can provide the path to the component you want to navigate to.
    this.router.navigate(['/home']); // Replace '/another-component' with your actual route
  }

  login(): void {
    this.router.navigate(['/login']);
  }
  
}