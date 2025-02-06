import { Component,OnInit } from '@angular/core';
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
      this.filteredEmployees = this.employee.filter(
        (emp) =>
          emp.employee_id.toString().includes(lowerCaseSearch) ||
          emp.name.toLowerCase().includes(lowerCaseSearch) ||
          emp.department.toLowerCase().includes(lowerCaseSearch) ||
          emp.job_title.toLowerCase().includes(lowerCaseSearch) ||
          emp.email.toLowerCase().includes(lowerCaseSearch)
      );
    }
  }
  sortDirection: Record<string, boolean> = {};
  sort(field: string) {
    const direction = (this.sortDirection[field] = !this.sortDirection[field])
      ? 1
      : -1;
    this.filteredEmployees.sort(
      (a, b) => (a[field] > b[field] ? 1 : -1) * direction
    );
  }
  empid(employeeId: object): void {
    this.router.navigate(['/view'], { queryParams: { id: employeeId } });
  }
}
