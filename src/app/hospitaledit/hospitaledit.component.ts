import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { HostaskService } from '../service/hostask.service';


@Component({
  selector: 'app-hospitaledit',
  standalone: false,
  
  templateUrl: './hospitaledit.component.html',
  styleUrl: './hospitaledit.component.css',
  
})
export class HospitaleditComponent implements OnInit {
  doctorForm!: FormGroup;
  doctorId!: number;

  departments: any[] = []; // Store the departments
  selectedImage: File | null = null;

  availabilityDates: string[] = []; // Store the availability dates
  newAvailabilityDate: string = ''; // Temporarily hold new availability date

  constructor(
    private fb: FormBuilder,
    private hostaskService: HostaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize the form with the availability_dates control
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      department: ['', [Validators.required]], // Add department field
      profile_image: [null], // For image input
      availability_dates: [this.availabilityDates], // Add availability_dates form control
    });

    // Get doctor ID from route params (if editing)
    this.route.params.subscribe((params) => {
      this.doctorId = params['id'];
      if (this.doctorId) {
        this.loadDoctorDetails(this.doctorId);
      }
    });
  }

  // Handle image selection
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Load existing doctor details for editing
  loadDoctorDetails(id: number) {
    this.hostaskService.getDoctor(id).subscribe(
      (data) => {
        console.log(data);
        this.doctorForm.patchValue({
          name: data.name,
          specialization: data.specialization,
          department: data.department,
          profile_image: `http://localhost:8000${data.profile_image}`, // Ensure the image is available in the data response
        });

        // Ensure availability dates are properly handled
      if (Array.isArray(data.availability_dates)) {
        this.availabilityDates = data.availability_dates;
      } else {
        this.availabilityDates = [data.availability_dates];
      }
        this.doctorForm.patchValue({
          availability_dates: this.availabilityDates, // Bind availability dates to the form
        });

        this.selectedImage = data.image; // Assuming image is part of the doctor data
      },
      (error) => {
        console.error('Error loading doctor details', error);
      }
    );
  }

  addAvailabilityDate(): void {
    if (this.newAvailabilityDate) {
      // You can format the date before adding it, if needed
      const formattedDate = new Date(this.newAvailabilityDate).toISOString();
      if (!this.availabilityDates.includes(formattedDate)) {
        this.availabilityDates.push(formattedDate);
        this.newAvailabilityDate = ''; // Clear input
        this.doctorForm.patchValue({
          availability_dates: this.availabilityDates, // Update form with new dates
        });
      }
    }
  }

  // Remove an availability date
  removeAvailabilityDate(index: number): void {
    this.availabilityDates.splice(index, 1);
    this.doctorForm.patchValue({
      availability_dates: this.availabilityDates, // Update the form after removal
    });
  }

  // Save or update the doctor
  onSubmit() {
    if (this.doctorForm.valid) {
      const formData = new FormData();

      // Append form fields to FormData
      formData.append('name', this.doctorForm.get('name')?.value);
      formData.append('specialization', this.doctorForm.get('specialization')?.value);
      formData.append('department', this.doctorForm.get('department')?.value);
      formData.append('availability_dates', JSON.stringify(this.availabilityDates));

      // Append image if selected
      if (this.selectedImage) {
        formData.append('profile_image', this.selectedImage, this.selectedImage.name);
      }

      if (this.doctorId) {
        // Call the update service
        this.hostaskService.updateDoctor(this.doctorId, formData).subscribe(
          (response) => {
            console.log('Doctor updated successfully', response);
            this.router.navigate(['/doctor-add']); // Redirect to doctors list
          },
          (error) => {
            console.error('Error updating doctor', error);
          }
        );
      } else {
        console.error('Doctor ID is missing. Cannot update doctor.');
      }
    } else {
      console.error('Form is invalid. Please check the input fields.');
    }
  }
}