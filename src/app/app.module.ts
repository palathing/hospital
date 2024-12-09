import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HostaskService } from './service/hostask.service';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { HospitaladdComponent } from './hospitaladd/hospitaladd.component';
import { HospitaleditComponent } from './hospitaledit/hospitaledit.component';
import { HospitalviewComponent } from './hospitalview/hospitalview.component';
import { UserappointmentComponent } from './userappointment/userappointment.component';
import { FormsModule } from '@angular/forms';
import { UseraddComponent } from './useradd/useradd.component';
import { LoginComponent } from './login/login.component';
import { ViewComponent } from './view/view.component';  // Add this import

@NgModule({
  declarations: [
    AppComponent,
    HospitaladdComponent,
    HospitaleditComponent,
    HospitalviewComponent,
    UserappointmentComponent,
    UseraddComponent,
    LoginComponent,
    ViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule, // Add it here
    FormsModule

  ],
  providers: [
    provideClientHydration(withEventReplay()),
    [provideHttpClient(withFetch())],

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
