import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  employee: any[] = [];
  filteredEmployees: any[] = [];
  searchControl = new FormControl('');

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.employeeService.getEmployee().subscribe((data) => {
      this.employee = data;
      this.filteredEmployees = data;
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((searchTerm) => {
        this.filterEmployees(searchTerm);
      });
  }
  filterEmployees(searchTerm: string | null) {
    
    if (searchTerm == null) {
      this.filteredEmployees = this.employee;
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      this.filteredEmployees = this.employee.filter((emp) => emp.employee_id.toString().includes(lowerCaseSearch) || 
      emp.name.toLowerCase().includes(lowerCaseSearch) || 
      emp.department.toLowerCase().includes(lowerCaseSearch) || 
      emp.job_title.toLowerCase().includes(lowerCaseSearch) || 
      emp.email.toLowerCase().includes(lowerCaseSearch)
      );
    }
  }

  sortDirection: { [key: string]: boolean } = {}; 
  sort(column: string) {
    this.sortDirection[column] = !this.sortDirection[column]; 
    const direction = this.sortDirection[column] ? 1 : -1;
    this.filteredEmployees.sort((a,b) => {
      if(a[column]<b[column]) return -1*direction;
      if(a[column]>b[column]) return 1*direction;
      return 0;
    });
  }

  empid(employeeId: object): void {
    this.router.navigate(['/view'], { queryParams: { id: employeeId } });
  }
}
