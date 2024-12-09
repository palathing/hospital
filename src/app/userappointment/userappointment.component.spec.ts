import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserappointmentComponent } from './userappointment.component';

describe('UserappointmentComponent', () => {
  let component: UserappointmentComponent;
  let fixture: ComponentFixture<UserappointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserappointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
