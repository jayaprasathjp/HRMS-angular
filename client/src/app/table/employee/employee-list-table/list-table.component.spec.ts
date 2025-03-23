import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTableComponent } from './list-table.component';
import { EmployeeService } from '../employee.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CourtesyTitlePipe } from '../employee.pipe';

describe('ListTableComponent', () => {
  let component: ListTableComponent;
  let fixture: ComponentFixture<ListTableComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getEmployee', 'fetchEmployee', 'deleteEmployee']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ListTableComponent,CourtesyTitlePipe],
      imports: [MatTableModule, MatPaginatorModule, MatSortModule,BrowserAnimationsModule],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTableComponent);
    component = fixture.componentInstance;
    mockEmployeeService.getEmployee.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEmployee on init', () => {
    expect(mockEmployeeService.getEmployee).toHaveBeenCalled();
  });

  it('should filter employees correctly', () => {
    component.employee = [
      {
        employee_id: 'EMP001', name: 'John Doe', email: 'john@example.com', salary: '50000', job_title: 'Developer', department: 'IT',
        gender: '',
        skills: '',
        phone_number: '',
        projects_completed: ''
      },
      {
        employee_id: 'EMP002', name: 'Jane Smith', email: 'jane@example.com', salary: '60000', job_title: 'Manager', department: 'HR',
        gender: '',
        skills: '',
        phone_number: '',
        projects_completed: ''
      }
    ];
    component.filterEmployees({ global_term: 'john' } as any);
    expect(component.filteredEmployees.length).toBe(1);
    expect(component.filteredEmployees[0].name).toBe('John Doe');
  });

  it('should navigate to view page', () => {
    component.view('EMP001');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view'], { queryParams: { id: 'EMP001' } });
  });
});
