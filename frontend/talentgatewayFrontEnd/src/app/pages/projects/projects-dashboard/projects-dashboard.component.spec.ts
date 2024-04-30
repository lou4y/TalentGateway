import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsDashboardComponent } from './projects-dashboard.component';

describe('ProjectsDashboardComponent', () => {
  let component: ProjectsDashboardComponent;
  let fixture: ComponentFixture<ProjectsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsDashboardComponent]
    });
    fixture = TestBed.createComponent(ProjectsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
