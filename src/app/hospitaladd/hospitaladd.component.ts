import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HostaskService } from '../service/hostask.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-hospitaladd',
  standalone: false,
  
  templateUrl: './hospitaladd.component.html',
  styleUrls: ['./hospitaladd.component.css'],
})
export class HospitaladdComponent implements OnInit {
  doctorForm: FormGroup;
  doctors: any[] = [];
  appointments: any[] = [];
  showForm: boolean = false;
  selectedFile: File | null = null;
  doctorImageUrl: string = '';  // Variable to store the image URL
  availabilityDates: string[] = []; // To store availability dates
  acceptedAppointments: any[] = [];


  constructor(private fb: FormBuilder, private hostaskService: HostaskService, private router: Router ) {
    this.doctorForm = this.fb.group({
      doctorId: [''], // Select doctor from dropdown
      appointmentDate: [''], // Example: new field
      description: [''], // Example: new field
      profile_image: [null, Validators.required],
      specialization: ['', Validators.required],
      name: ['', Validators.required],
      department: ['', Validators.required],
      availabilityDates: this.fb.array([]),  // Use FormArray for storing multiple dates

    });
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadAppointments();
    this.initializeAvailabilityDates();  // Add this call to initialize availability dates
    this.loadAcceptedAppointments();

  }

  loadAcceptedAppointments(): void {
    this.hostaskService.getAppointments().subscribe((appointments) => {
      this.acceptedAppointments = appointments.filter(appointment => appointment.is_accepted);
    });
  }

  // Initialize availability dates if they exist
initializeAvailabilityDates(): void {
  const doctor = this.doctorForm.get('availabilityDates') as FormArray;
  this.availabilityDates.forEach(date => {
    doctor.push(this.fb.control(date));
  });
}

  // Toggle the visibility of the doctor form
  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  loadDoctors(): void {
    this.hostaskService.getDoctors().subscribe(
      (data) => {
        // Ensure availability_dates is always an array
        this.doctors = data.map((doctor: any) => ({
          ...doctor,
          availability_dates: Array.isArray(doctor.availability_dates)
            ? doctor.availability_dates
            : [doctor.availability_dates], // Convert string to array
        }));
        console.log('Doctors loaded:', this.doctors);
      },
      (error) => {
        console.error('Error loading doctors:', error);
      }
    );
  }

  loadDoctorDetails(doctorId: number): void {
    this.hostaskService.getDoctor(doctorId).subscribe(
      (data) => {
        this.doctorForm.patchValue({
          name: data.name,
          specialization: data.specialization,
          department: data.department,
          profile_image: data.profile_image,  // Make sure to handle the image properly
        });
  
        const availabilityDates = data.availability_dates;
        const availabilityFormArray = this.doctorForm.get('availabilityDates') as FormArray;
        availabilityDates.forEach((date: string) => {
          availabilityFormArray.push(this.fb.control(date));
        });
        console.log('Availability Dates:', availabilityDates);

      },
      (error) => {
        console.error('Error loading doctor details:', error);
      }
    );
  }
  

    // Fetch appointments from the backend
  loadAppointments(): void {
    this.hostaskService.getAppointments().subscribe(
      (data) => {
        // Populate nested doctor details if needed
      this.appointments = data.map((appointment) => ({
        ...appointment,
        doctor: this.doctors.find((doc) => doc.id === appointment.doctorId) || {},
      }));
        console.log('Appointments loaded:', this.appointments);
      },
      (error) => {
        console.error('Error loading appointments:', error);
      }
    );
  }

  // Handle file change (to select a profile image)
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.doctorForm.patchValue({ profile_image: file });
      this.doctorImageUrl = URL.createObjectURL(file); // Preview image locally

    }
  }

  // Add an availability date to the list
  addAvailabilityDate(): void {
    const dateControl = this.fb.control(this.doctorForm.value.availabilityDates);
    if (dateControl.value && !this.availabilityDates.includes(dateControl.value)) {
      this.availabilityDates.push(dateControl.value);
      (this.doctorForm.get('availabilityDates') as FormArray).push(dateControl);
    }
  }

  // Remove a date from availability
  removeAvailabilityDate(index: number): void {
    this.availabilityDates.splice(index, 1);
  }


  onSubmit(): void {
    if (this.doctorForm.valid) {
      const formData = new FormData();
      formData.append('name', this.doctorForm.value.name);
      formData.append('specialization', this.doctorForm.value.specialization);
      formData.append('department', this.doctorForm.value.department);
      // const availabilityDates = this.doctorForm.get('availabilityDates')?.value;
      // formData.append('availability_dates', JSON.stringify(this.availabilityDates));
      // Handle availability dates
      const availabilityDates = this.doctorForm.get('availabilityDates')?.value;
      if (availabilityDates && Array.isArray(availabilityDates)) {
        console.log('Appending availability dates:', availabilityDates);

        formData.append('availability_dates', JSON.stringify(availabilityDates)); // Ensure correct serialization
      }
      // Append the profile image file
      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile, this.selectedFile.name);
      }else {
        console.error('Profile image is required!');
        return;
      }
      // Log FormData contents to verify
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      // Call the service to submit the data
      this.hostaskService.addDoctor(formData).subscribe(
        (response) => {
          console.log('Doctor added:', response);
          this.loadDoctors(); // Refresh the doctor list
          this.toggleForm(); // Hide the form after submission
        },
        (error) => {
          console.error('Error adding doctor:', error);
          // Check if the backend returned additional error details
          if (error.error && error.error.department) {
            console.error('Department error:', error.error.department);
          }
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  // Navigate to the edit component with the doctor's ID
  editDoctor(doctorId: number): void {
    this.router.navigate(['/doctor-edit', doctorId]);
  }

  // Navigate to the edit component with the doctor's ID
  viewDoctor(doctorId: number): void {
    this.router.navigate(['/doctor-view', doctorId]);
  }

  // To display the profile image (if available)
  // getImageUrl(url: string): string {
  //   // If the URL is relative, prepend the base URL
  //   if (url && !url.startsWith('http')) {
  //     return `http://127.0.0.1:8000/${url}`;
  //   }
  //   return url || 'assets/default-course-image.jpg';
  // }

  handleImageError(event: any) {
    console.error('Image load failed:', event.target.src);
    // event.target.src = 'assets/default-course-image.jpg';
  }

  



  // // Delete a doctor (implement API call in service)
  deleteDoctor(doctorId: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.hostaskService.deleteDoctor(doctorId).subscribe(
        (response) => {
          console.log('Doctor deleted:', response);
          this.loadDoctors(); // Refresh the doctor list
        },
        (error) => {
          console.error('Error deleting doctor:', error);
        }
      );
    }
  }



  acceptAppointment(appointmentId: number): void {
    this.hostaskService.acceptAppointment(appointmentId).subscribe(
      (response) => {
        console.log('Appointment accepted:', response);
        // Optionally refresh the appointment list or change the status
        this.loadAppointments();  // Reload appointments to reflect the change
      },
      (error) => {
        console.error('Error accepting appointment:', error);
      }
    );
  }
  
}