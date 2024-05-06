import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprojectWithTeamComponent } from './addproject-with-team.component';

describe('AddprojectWithTeamComponent', () => {
  let component: AddprojectWithTeamComponent;
  let fixture: ComponentFixture<AddprojectWithTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddprojectWithTeamComponent]
    });
    fixture = TestBed.createComponent(AddprojectWithTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
