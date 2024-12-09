import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HostaskService {

  private baseUrl = 'http://127.0.0.1:8000'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  private notificationSubject = new BehaviorSubject<string | null>(null);
  notification$ = this.notificationSubject.asObservable();

  

  // Fetch all doctors
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admins/doctors/`);
  }

  // Fetch all appointments
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admins/appointments/`);
  }

  viewAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/views/`);
  }
  

   // Add a new doctor (including the profile image)
   addDoctor(doctorData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admins/doctors/`, doctorData);
  }

  // Method to delete a doctor by ID
  deleteDoctor(doctorId: number): Observable<any> {
    const url = `${this.baseUrl}/admins/doctors/${doctorId}/`; // Assuming the URL is like /admins/doctors/1/
    return this.http.delete<any>(url); // Sending a DELETE request to the server
  }

  // Get doctor details for editing
  getDoctor(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/admins/doctors/${id}/`);
  }

  // Create a new doctor
  createDoctor(doctorData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admins`, doctorData);
  }

  // Update doctor
  updateDoctor(id: number, doctorData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admins/doctors/${id}/`, doctorData);
  }

  // Fetch all states
  getStates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/state/`);
  }

  // Fetch cities based on state ID
  getCities(stateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/city/`);
  }

  

  // Create a new user
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user-profile/`, data);
  }


  // Register a new user
  registerUser(userData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, userData);  // Assuming this endpoint exists
  }

  // Check if the email is already registered
  checkEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/app/check-email/?email=${email}`);
  }

  // Method to fetch all users from the backend
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user-profile/`);  // Adjust the URL based on your API endpoint
  }

  // Fetch user profile by name
  getUserProfile(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user-profile/${name}/`);
  }

  // Fetch specializations from the backend
  getSpecializations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/admins/specializations`);
  }

  // Fetch doctors by specialization
  getDoctorsBySpecialization(specialization: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admins/doctors/specialization/${specialization}`);
  }

  // Book appointment
  bookAppointment(appointmentData: any): Observable<any> {
    console.log(appointmentData)
    return this.http.post(`${this.baseUrl}/admins/appointment/`, appointmentData);
  }

  // Fetch the list of doctors
  // getDoctors() {
  //   return this.http.get<{ id: number; name: string }[]>('/api/doctors');
  // }
  
   // Fetch appointment date for a selected doctor
   getAppointmentDate(doctorId: number) {
    return this.http.get<{ appointment_date: string }>(`/admins/doctors/${doctorId}/appointment-date`);
  }

  getAvailableDates(doctorId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/admins/doctors/${doctorId}/available-dates/`);
  }

  // Method to accept an appointment
  acceptAppointment(data: any): Observable<any> {
    console.log(data)
    return this.http.post(`${this.baseUrl}/admins/appointments/accept/`,data);
  }


  notify(message: string): void {
    this.notificationSubject.next(message);
  }

  clearNotification(): void {
    this.notificationSubject.next(null);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, credentials);
  }

}
