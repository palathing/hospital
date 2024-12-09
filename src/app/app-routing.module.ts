import { NgModule, ɵChangeDetectionSchedulerImpl } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitaladdComponent } from './hospitaladd/hospitaladd.component';
import { HospitaleditComponent } from './hospitaledit/hospitaledit.component';
import { HospitalviewComponent } from './hospitalview/hospitalview.component';
import { UserappointmentComponent } from './userappointment/userappointment.component';
import { UseraddComponent } from './useradd/useradd.component';
import { LoginComponent } from './login/login.component';
import { ViewComponent } from './view/view.component';
const routes: Routes = [
  { path: '', component: UserappointmentComponent },
  {path:'login',component:LoginComponent},
  { path: 'home', component: UseraddComponent },
  {path:'view',component:ViewComponent},
  { path: 'doctor-add', component: HospitaladdComponent },
  { path: 'doctor-edit/:id', component: HospitaleditComponent },
  { path: 'doctor-view/:id', component: HospitalviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
