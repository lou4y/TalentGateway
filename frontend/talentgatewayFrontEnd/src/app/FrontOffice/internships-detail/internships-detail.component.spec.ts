import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipsDetailComponent } from './internships-detail.component';

describe('InternshipsDetailComponent', () => {
  let component: InternshipsDetailComponent;
  let fixture: ComponentFixture<InternshipsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternshipsDetailComponent]
    });
    fixture = TestBed.createComponent(InternshipsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
