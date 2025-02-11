import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})

export class ListComponent implements OnInit {
  employee: any[] = [];
  filteredEmployees: any[] = [];
  searchControl = new FormControl('');

  constructor(private employeeService: EmployeeService,private router: Router) {}

  ngOnInit(): void {
    this.employeeService.getEmployee().subscribe((data) => {
      this.employee = data;
      this.filteredEmployees = data;
  });

  this.searchControl.valueChanges
      .subscribe((term) => {
        this.filterEmployees(term);
      });
  }

  filterEmployees(term: string | null) {
    if (term == null) {
      this.filteredEmployees = this.employee;
    } else {
      const lower = term.toLowerCase();
      this.filteredEmployees = this.employee.filter(
        (emp) =>
          emp.employee_id.toString().includes(lower) ||
          emp.name.toLowerCase().includes(lower) ||
          emp.department.toLowerCase().includes(lower) ||
          emp.job_title.toLowerCase().includes(lower) ||
          emp.email.toLowerCase().includes(lower)
      );
    }
  }

  sortDirection: Record<string, boolean> = {};
  sort(field: string) {
    const direction = (this.sortDirection[field] = !this.sortDirection[field])? 1: -1;
    this.filteredEmployees.sort((a, b) => (a[field] > b[field] ? 1 : -1) * direction);
  }
  
  view(employeeId: object): void {
    this.router.navigate(['/view'], { queryParams: { id: employeeId } });
  }
}
