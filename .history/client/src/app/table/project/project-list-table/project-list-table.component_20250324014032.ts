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
import { FormControl } from '@angular/forms';
import { Project, ProjectSearchModel } from '../../../employee.model';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import Toastify from 'toastify-js';
import { EmployeeEditComponent } from 'src/app/edit-model/employee-edit/employee-edit.component';
import * as saveAs from 'file-saver';
import { ProjectService } from 'src/app/project.service';
import { ProjectEditComponent } from 'src/app/edit-model/project-edit/project-edit.component';

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
    global_term: '',
  };
  project: Project[] = [];
  filteredProjects: Project[] = [];
  searchControl = new FormControl('');

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private cdr:ChangeDetectorRef
  ) {}

  displayedColumns: string[] = [
    'index',
    'name',
    'lead',
    'manager',
    'team_count',
    'action',
  ];
  
  dataSource = new MatTableDataSource<Project>(this.filteredProjects);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (
      item: Project,
      sortHeader: string
    ): string | number => {
      if (sortHeader === 'team_count') {
        return parseInt(
          item[sortHeader as keyof Project]?.replace(/\D/g, ''),
          10
        );
      } else if (
        sortHeader === 'lead' ||
        sortHeader === 'name' ||
        sortHeader === 'manager'
      ) {
        return item[sortHeader as keyof Project]?.trim().toLowerCase();
      }
      return item[sortHeader as keyof Project] as string | number;
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
    this.searchObj[field as keyof ProjectSearchModel] = term;
    this.filterProjects(this.searchObj);
  }
  
  ngOnInit(): void {
    if (this.filteredProjects.length === 0)
      this.projectService.getProject().subscribe((data) => {
        this.project = data;
        this.filteredProjects = this.project;
        this.dataSource.data = this.filteredProjects;
        this.changeDetect();
      });
  }

  changeDetect() {
    this.cdr.detectChanges();
  }


  openDialog(projectData: Project) {
    const dialogRef = this.dialog.open(ProjectEditComponent, {
      width: '800px',
      height: '580px',
      data: projectData,
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
