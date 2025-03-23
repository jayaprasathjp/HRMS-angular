import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectEditComponent } from 'src/app/edit-model/project-edit/project-edit.component';
import { Employee, Project } from 'src/app/employee.model';
import { EmployeeService } from 'src/app/employee.service';
import { ProjectService } from 'src/app/project.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent {
  employee: Employee[] = [];
  filteredEmployees: Employee[] = [];
  project: Project = {
    name: '',
    description: '',
    lead: '',
    manager: ''
  };
  private _liveAnnouncer = inject(LiveAnnouncer);
  constructor(
     private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private projectService: ProjectService
  ) {}

  displayedColumns: string[] = [
    'index',
    'emp_id',
    'name',
    'role',
  ];
  
  dataSource = new MatTableDataSource<Employee>(this.employee);

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
        sortHeader === 'role' ||
        sortHeader === 'name' ||
        sortHeader === 'reports_to' 
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

  ngOnInit(): void {
    
    this.route.queryParams.subscribe((params) => {
      const name = params['name'];
      this.projectService.getProject().subscribe((data)=>{
        this.project = data.find((prj) => prj.name == name)|| ({} as Project);
        this.employeeService.getEmployee().subscribe((data) => {
          this.filteredEmployees=data.filter((emp)=>{
            return emp.project==this.project.name})
          this.dataSource.data = this.filteredEmployees;
    });
      });
    });
  }
   openDialog(projectData: Project) {
      const dialogRef = this.dialog.open(ProjectEditComponent, {
        width: '800px',
        height: '520px',
        data: projectData,
      });
    }
    
  view(employeeId: string): void {
    this.router.navigate(['/employee-view'], { queryParams: { id: employeeId } });
  }
}
