import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternshipsComponent } from './add-internships.component';

describe('AddInternshipsComponent', () => {
  let component: AddInternshipsComponent;
  let fixture: ComponentFixture<AddInternshipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInternshipsComponent]
    });
    fixture = TestBed.createComponent(AddInternshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
