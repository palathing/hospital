import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { HostaskService } from '../service/hostask.service';

@Component({
  selector: 'app-hospitalview',
  standalone: false,
  
  templateUrl: './hospitalview.component.html',
  styleUrl: './hospitalview.component.css'
})
export class HospitalviewComponent implements OnInit {
  doctorForm!: FormGroup;
  doctorId!: number;

  departments: any[] = [];  // Store the departments
  selectedImage: File | null = null; 


  constructor(
    private fb: FormBuilder,
    private hostaskService: HostaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Initialize the form
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      department: ['', [Validators.required]],  // Add department field
      profile_image: [null]  // For image input  // Assuming state is part of the form
    });

     // Load states (this should come from your backend or a service)
    //  this.loadStates();
    // this.loadDepartments();

    // Get doctor ID from route params (if editing)
    this.route.params.subscribe(params => {
      this.doctorId = params['id'];
      if (this.doctorId) {
        this.loadDoctorDetails(this.doctorId);
      }
    });
  }

  // Load departments from the API
  // loadDepartments() {
  //   this.hostaskService.getDepartments().subscribe((data: any) => {
  //     this.departments = data;
  //   }, (error) => {
  //     console.error('Error loading departments', error);
  //   });
  // }

  // Handle image selection
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }



  // Load existing doctor details for editing
  loadDoctorDetails(id: number) {
    this.hostaskService.getDoctor(id).subscribe((data) => {
      console.log(data);
      this.doctorForm.patchValue({
        name: data.name,
        specialization: data.specialization,
        department: data.department,
        profile_image: `http://localhost:8000${data.profile_image}`,  // Ensure the image is available in the data response
      });      
      // this.departments = data;  // Store the departments data
      this.selectedImage = data.image;  // Assuming image is part of the doctor data
    }, (error) => {
      console.error('Error loading doctor details', error);
    });
  }

  goBack() {
    this.router.navigate(['/doctor-add']);
  }

  
}