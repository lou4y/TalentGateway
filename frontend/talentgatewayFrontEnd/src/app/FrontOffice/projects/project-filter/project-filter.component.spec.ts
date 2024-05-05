import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFilterComponent } from './project-filter.component';

describe('ProjectFilterComponent', () => {
  let component: ProjectFilterComponent;
  let fixture: ComponentFixture<ProjectFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectFilterComponent]
    });
    fixture = TestBed.createComponent(ProjectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
