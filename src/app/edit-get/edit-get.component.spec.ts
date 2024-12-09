import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGetComponent } from './edit-get.component';

describe('EditGetComponent', () => {
  let component: EditGetComponent;
  let fixture: ComponentFixture<EditGetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditGetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
