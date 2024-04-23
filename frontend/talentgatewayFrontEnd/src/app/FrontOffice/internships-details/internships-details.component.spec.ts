import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipsDetailsComponent } from './internships-details.component';

describe('InternshipsDetailsComponent', () => {
  let component: InternshipsDetailsComponent;
  let fixture: ComponentFixture<InternshipsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternshipsDetailsComponent]
    });
    fixture = TestBed.createComponent(InternshipsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
