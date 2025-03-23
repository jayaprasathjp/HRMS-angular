import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../employee.service';
import { FormControl } from '@angular/forms';
import { Employee, ProjectSearchModel } from '../../../employee.model';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import Toastify from 'toastify-js';
import { EmployeeEditComponent } from 'src/app/edit-model/employee-edit/employee-edit.component';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-project-list-table',
  templateUrl: './project-list-table.component.html',
  styleUrls: ['./project-list-table.component.css']
})
export class ProjectListTableComponent implements OnInit, OnChanges {
  private _liveAnnouncer = inject(LiveAnnouncer);
  @Input() term: string = '';
  @Output() searchCount = new EventEmitter<number>();
  searchObj: ProjectSearchModel = {
    name: '',
    lead: '',
    manager:'',
    reports_to: '',
    global_term: '',
  };
  employee: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchControl = new FormControl('');

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog,
    private cdr:ChangeDetectorRef
  ) {}

  displayedColumns: string[] = [
    'index',
    'emp_id',
    'name',
    'role',
    'project',
    'reports_to',
    'action',
  ];
  
  dataSource = new MatTableDataSource<Employee>(this.filteredEmployees);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (
      item: Employee,
      sortHeader: string
    ): string | number => {
      if (sortHeader === 'emp_id') {
        return parseInt(
          item[sortHeader as keyof Employee]?.replace(/\D/g, ''),
          10
        );
      } else if (
        sortHeader === 'department' ||
        sortHeader === 'name' ||
        sortHeader === 'job_title' ||
        sortHeader === 'email'
      ) {
        return item[sortHeader as keyof Employee]?.trim().toLowerCase();
      }
      return item[sortHeader as keyof Employee] as string | number;
    };
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  trackChange(field: string, event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchObj[field as keyof EmployeeSearchModel] = term;
    this.filterEmployees(this.searchObj);
  }
  
  ngOnInit(): void {
    if (this.filteredEmployees.length === 0)
      this.employeeService.getEmployee().subscribe((data) => {
        this.employee = data;
        this.filteredEmployees = this.employee;
        this.dataSource.data = this.filteredEmployees;
        this.changeDetect();
      });
  }

  changeDetect() {
    this.cdr.detectChanges();
  }


  openDialog(employeeData: Employee) {
    const dialogRef = this.dialog.open(EmployeeEditComponent, {
      width: '800px',
      height: '580px',
      data: employeeData,
    });
  }
  delete(empId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(empId).subscribe(
          (response) => {
            this.employeeService.fetchEmployee();
            this.changeDetect();
            console.log('Updated:', response);
          },
          (error) => {
            Toastify({
              text: 'Server request failed!',
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              duration: 10000,
              gravity: 'right',
              position: 'right',
              transition: 'Bounce',
              backgroundColor: 'red',
              close:true
            }).showToast();
            console.error('Update error:', error);
          }
        );
        Swal.fire({
          title: 'Deleted!',
          text: 'Employee data has been deleted.',
          icon: 'success',
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.searchObj['global_term' as keyof EmployeeSearchModel] = this.term;
    this.filterEmployees(this.searchObj);
    this.changeDetect();
  }

  filterEmployees(searchObj: EmployeeSearchModel) {
    const fieldFiltered = this.employee.filter((emp) => {
      const fieldSearch = Object.entries(searchObj).every(([key, value]) => {
        if (key === 'global_term' || value === '') return true;
        return (emp as any)[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      return fieldSearch;
    });

    const lower = searchObj.global_term.toLowerCase();
    this.filteredEmployees = fieldFiltered.filter(
      (emp) =>
        emp.emp_id.toString().includes(lower) ||
        emp.name.toLowerCase().includes(lower) ||
        emp.role.toLowerCase().includes(lower) ||
        emp.project.toLowerCase().includes(lower) ||
        emp.reports_to.toLowerCase().includes(lower)
    );
    this.searchCount.emit(this.filteredEmployees.length);
    this.dataSource.data = this.filteredEmployees;
    this.changeDetect();
  }
  
  generatePdf(){
    let sortedFilteredData = this.dataSource.sortData(this.dataSource.filteredData, this.sort);
    this.employeeService.generatePDF(sortedFilteredData).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      saveAs(blob, 'employee_details.pdf');
    }, error => {
      console.error('Error downloading PDF:', error);
    });
  }


  view(employeeId: string): void {
    this.router.navigate(['/employee-view'], { queryParams: { id: employeeId } });
  }
}
