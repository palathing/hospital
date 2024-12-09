import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HostaskService } from '../service/hostask.service';
@Component({
  selector: 'app-view',
  standalone: false,
  
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
  appointments: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private appointmentService: HostaskService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Fetch appointments from the service
  loadAppointments(): void {
    this.appointmentService.viewAppointments().subscribe(
      (data) => {
        this.appointments = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching appointments:', error);
        this.error = 'Failed to load appointments. Please try again later.';
        this.loading = false;
      }
    );
  }

  // Accept an appointment and navigate to the details page
  acceptAppointment(appointmentId: number): void {
    const appointment = this.appointments.find(app => app.id === appointmentId);

    if (appointment) {
      appointment.isAccepted = true; // Mark as accepted
      this.router.navigate(['appointment-details'], {
        state: { appointment: appointment }
      });
    }
  }
}