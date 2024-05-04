import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInternshipComponent } from './update-internship.component';

describe('UpdateInternshipComponent', () => {
  let component: UpdateInternshipComponent;
  let fixture: ComponentFixture<UpdateInternshipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateInternshipComponent]
    });
    fixture = TestBed.createComponent(UpdateInternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
