import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitaladdComponent } from './hospitaladd.component';

describe('HospitaladdComponent', () => {
  let component: HospitaladdComponent;
  let fixture: ComponentFixture<HospitaladdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitaladdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitaladdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
