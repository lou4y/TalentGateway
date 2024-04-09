// myapplication.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyapplicationComponent } from './myapplication.component'; // Importez MyapplicationComponent
import { InterviewService } from 'src/app/services/interview.service';
import { of } from 'rxjs';

describe('MyapplicationComponent', () => { // Renommez AllapplicationComponent en MyapplicationComponent
  let component: MyapplicationComponent; // Renommez AllapplicationComponent en MyapplicationComponent
  let fixture: ComponentFixture<MyapplicationComponent>; // Renommez AllapplicationComponent en MyapplicationComponent
  let mockInterviewService: jasmine.SpyObj<InterviewService>;

  beforeEach(async () => {
    mockInterviewService = jasmine.createSpyObj<InterviewService>('InterviewService', ['getAllApplications']);

    await TestBed.configureTestingModule({
      declarations: [ MyapplicationComponent ], // Renommez AllapplicationComponent en MyapplicationComponent
      providers: [{ provide: InterviewService, useValue: mockInterviewService }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyapplicationComponent); // Renommez AllapplicationComponent en MyapplicationComponent
    component = fixture.componentInstance; // Renommez AllapplicationComponent en MyapplicationComponent
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllApplications on ngOnInit', () => {
    const mockData = [{ id: '1', name: 'Interview 1' }, { id: '2', name: 'Interview 2' }];
    mockInterviewService.getAllApplications.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(mockInterviewService.getAllApplications).toHaveBeenCalled();
    expect(component.lists).toEqual(mockData);
  });

  it('should log error if getAllApplications fails', () => {
    const mockError = 'Error fetching applications';
    mockInterviewService.getAllApplications.and.returnValue(of(mockError));

    spyOn(console, 'error');

    component.ngOnInit();

    expect(mockInterviewService.getAllApplications).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching applications:', mockError);
  });
});
