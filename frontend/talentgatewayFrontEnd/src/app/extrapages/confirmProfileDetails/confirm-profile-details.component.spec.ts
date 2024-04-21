import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProfileDetailsComponent } from './confirm-profile-details.component';

describe('ConfirmmailComponent', () => {
  let component: ConfirmProfileDetailsComponent;
  let fixture: ComponentFixture<ConfirmProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmProfileDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
