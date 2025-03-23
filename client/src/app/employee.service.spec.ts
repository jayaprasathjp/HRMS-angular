import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { LoaderService } from './loader/loader.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeService,
        { provide: LoaderService, useValue: loaderServiceSpy },
      ],
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch employees and update BehaviorSubject', () => {
    const mockEmployees: Employee[] = [
      {
        employee_id: 'EMP1',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
        phone_number: '1234567890',
        salary: '50000',
        department: 'IT',
        job_title: 'Developer',
        skills: 'Angular',
        projects_completed: '2',
      },
    ];

    service.fetchEmployee();
    const req = httpMock.expectOne('http://localhost:3000/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);

    service.getEmployee().subscribe((employees) => {
      expect(employees.length).toBe(1);
      expect(employees).toEqual(mockEmployees);
    });

    expect(loaderServiceSpy.show).toHaveBeenCalled();
    expect(loaderServiceSpy.hide).toHaveBeenCalled();
  });

  it('should delete an employee', () => {
    const empId = 'EMP3';

    service.deleteEmployee(empId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/data/3');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
