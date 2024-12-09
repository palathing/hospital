import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitaleditComponent } from './hospitaledit.component';

describe('HospitaleditComponent', () => {
  let component: HospitaleditComponent;
  let fixture: ComponentFixture<HospitaleditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitaleditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitaleditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
