// interview.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { InterviewService } from './interview.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('InterviewService', () => {
  let service: InterviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InterviewService]
    });
    service = TestBed.inject(InterviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all applications via GET request', () => {
    const mockData = [{ id: '1', name: 'Interview 1' }, { id: '2', name: 'Interview 2' }];
    service.getAllApplications().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const request = httpMock.expectOne('http://localhost:8080/api/application/all');
    expect(request.request.method).toBe('GET');
    request.flush(mockData);
  });

  
});
