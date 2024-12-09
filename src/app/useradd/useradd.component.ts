import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HostaskService } from '../service/hostask.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-useradd',
  standalone: false,
  
  templateUrl: './useradd.component.html',
  styleUrl: './useradd.component.css'
})
export class UseraddComponent implements OnInit {
  appointmentForm: FormGroup;
  specializations: string[] = [];
  doctors: any[] = [];
  selectedSpecialization: string = '';
  selectedDoctor: any = null;
  availableDates: string[] = [];  // Store available dates for selected doctor

  loginUserID: number = 0;
  loginUserType: number = 0;
  receivedData: any;
  idDict: any;

  submittedAppointments: any[] = [];  // Array to store submitted appointments
  userProfile: any = {}; // Add this declaration with a default value
  isDoctorAvailable: boolean = false;  // Add this flag to track availability

  constructor(private fb: FormBuilder, private hostaskService: HostaskService, private route: ActivatedRoute ,
    private router: Router) {
    this.appointmentForm = this.fb.group({
      specialization: ['', Validators.required],
      doctor: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      description: ['', Validators.required],

    });
  }

  // Load doctors based on the selected specialization
  loadDoctors(specialization: string): void {
    console.log('Loading doctors for specialization:', specialization); // Log specialization value
  this.hostaskService.getDoctorsBySpecialization(specialization).subscribe(
    (data: any[]) => {
      console.log('Doctors:', data); // Log fetched doctors
      this.doctors = data; // Update the doctors array
      if (this.doctors.length === 0) {
        console.log('No doctors found for this specialization.');
      }
    },
    (error) => {
      console.error('Error fetching doctors:', error); // Log any error
    }
  );
  }

  loadAvailableDates(doctorId: string): void {
    this.hostaskService.getAvailableDates(doctorId).subscribe(
      (dates: string[]) => {
        // this.availableDates = dates;
        console.log('Available Dates for Doctor ID', doctorId, ':', dates);
        this.availableDates = dates;

        if (this.availableDates.length === 0) {
          console.log('No available dates for the selected doctor.');
        }
      },
      (error) => {
        console.error('Error fetching available dates:', error);
      }
    );
  }

  ngOnInit(): void {
    this.loadSpecializations();
    this.fetchUserProfile();
    this.initializeForm();

    this.route.queryParams.subscribe(params => {
      const data = params['data'];
      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.loginUserID = this.receivedData['loginUserID']
          this.loginUserType = this.receivedData['loginUserType']

        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });

    this.hostaskService.getUsers().subscribe(
      (data: any) => {
        this.userProfile = data;
        this.initializeForm();  // Call form initialization after profile data is loaded
      },
    (error) => {
      console.error('Error fetching user profile:', error);  // Log error if any
    }
    );
  }

  fetchUserProfile(): void {
    this.hostaskService.getUsers().subscribe(
      (data: any) => {
        this.userProfile = data;
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  initializeForm(): void {
    this.appointmentForm = this.fb.group({
     // Use the name here
      appointmentDate: ['', Validators.required],
      specialization: ['', Validators.required],
      doctor: ['', Validators.required],
      description: ['']
    });
  }

  // Load specializations from the backend
  loadSpecializations(): void {
    this.hostaskService.getSpecializations().subscribe((data: any[]) => {
      console.log('Specializations:', data);  // Log the data received from the backend
      this.specializations = data;
    }, error => {
      console.error('Error fetching specializations:', error);  // Log any error from the backend
    });
  }

  loadDoctorsBySpecialization(specialization: string): void {
    this.hostaskService.getDoctorsBySpecialization(specialization).subscribe(
      (response: any) => {
        // Iterate over each doctor and log their details, including appointment dates
        response.forEach((doctor: any) => {
          console.log(`Doctor ID: ${doctor.id}, Name: ${doctor.name}, Appointment Dates: ${doctor.appointment_dates}`);
        });
      },
      (error) => {
        console.error('Error fetching doctors by specialization:', error);
      }
    );
  }
  

  

  // Handle the specialization selection change
  onSpecializationChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSpecialization = selectElement.value;
  
    console.log('Selected Specialization:', this.selectedSpecialization);

    // Synchronize with form control
    this.appointmentForm.get('specialization')?.setValue(this.selectedSpecialization);
  
    console.log('Selected Specialization:', this.selectedSpecialization);
    this.loadDoctors(this.selectedSpecialization);

    this.appointmentForm.get('specialization')?.setValue(this.selectedSpecialization);


    // Load doctors based on the selected specialization
  if (this.selectedSpecialization) {
    this.loadDoctors(this.selectedSpecialization);
  }
  
  }




  onDoctorChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const doctorId = selectElement.value;
    this.selectedDoctor = this.doctors.find(doc => doc.id === doctorId);
    console.log('Selected Doctor ID:', doctorId);  // Log the selected doctor ID

    this.loadAvailableDates(doctorId);

    // Fetch available dates for the selected doctor
  if (doctorId) {
    this.loadAvailableDates(doctorId); // Update availableDates for this doctor
  } else {
    this.availableDates = []; // Clear available dates if no doctor is selected
  }
  }

  onDateChange(): void {
    // Check if the selected appointment date is available for the doctor
    const selectedDate = this.appointmentForm.get('appointmentDate')?.value;
    if (this.availableDates.includes(selectedDate)) {
      this.isDoctorAvailable = true;
    } else {
      this.isDoctorAvailable = false;
    }
  }
  

  // Submit the appointment form
  submitAppointment(): void {
    if (this.appointmentForm.invalid) {
      return;
    }
    const appointmentData = {
      ...this.appointmentForm.value,
      specialization: this.appointmentForm.value.specialization, // Send specialization value
      doctor: this.appointmentForm.value.doctor, // Send doctor ID
      appointment_date: new Date(this.appointmentForm.value.appointmentDate).toISOString().split('T')[0],  // Date in YYYY-MM-DD format
      // name: this.appointmentForm.value.user,    // ID of the user (UserProfile)
      user: this.loginUserID, // Include the logged-in user's ID

      description: this.appointmentForm.value.description // Description


    };
    console.log('Appointment Data:', appointmentData);  // Log the data being sent

    // appointmentData.appointment_date = new Date(this.appointmentForm.value.appointmentDate).toISOString();


    this.hostaskService.bookAppointment(appointmentData).subscribe(response => {
      console.log('Appointment booked:', response);

      this.submittedAppointments.push(response);

      // Add the submitted appointment to the list
      this.submittedAppointments.push(appointmentData);

      // Optionally, reset the form after submission
      this.appointmentForm.reset();
    },
    (error) => {
      console.error('Error booking appointment:', error);
    
    });
  }

  view(): void {
    this.router.navigate(['/view']);
  }
  
}