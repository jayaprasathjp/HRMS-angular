import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { FormControl } from '@angular/forms';
import { Employee,searchModel } from '../employee.model';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.css'],
})
export class ListTableComponent implements OnInit, OnChanges {
  @Input() term: string = '';
  @Output() searchCount = new EventEmitter<number>();
  searchObj:searchModel={
    name: "",
    email: "",
    salary: "",
    job_title: "",
    department: "",
    employee_id: "",
     global_term:""
  };
  employee: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchControl = new FormControl('');

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}
  trackChange(field: string, event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchObj[field as keyof searchModel]=term;
    
    this.filterEmployees(this.searchObj);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.searchObj["global_term" as keyof searchModel]=this.term;
    this.filterEmployees(this.searchObj);
  }

  ngOnInit(): void {
    this.employeeService.getEmployee().subscribe((data) => {
      this.employee = data;
      this.filteredEmployees = this.employee;
    });
  }

  filterEmployees(searchObj:searchModel) {
     const fieldFiltered = this.employee.filter(emp => {
      const fieldSearch = Object.entries(searchObj).every(([key, value]) => {
          if (key === "global_term" || value === "") return true;
          return (emp as any)[key]?.toString().toLowerCase().includes(value.toLowerCase());
      });
      return fieldSearch;
  });
  const lower = searchObj.global_term.toLowerCase();
  this.filteredEmployees = fieldFiltered.filter(
    (emp) =>
      emp.employee_id.toString().includes(lower) ||
      emp.name.toLowerCase().includes(lower) ||
      emp.department.toLowerCase().includes(lower) ||
      emp.job_title.toLowerCase().includes(lower) ||
      emp.email.toLowerCase().includes(lower)||
      emp.salary.toLowerCase().includes(lower)
  );
  this.searchCount.emit(this.filteredEmployees.length); 
  }

  // filterEmployees(term: string | null) {
  //   if (!term) {
  //     this.filteredEmployees = this.employee;
  //     return;
  //   }

  //   const lowerTerm = term.toLowerCase();
  //   const priorityMap = new Map<number, any[]>(); // Map of position -> matching employees

  //   this.employee.forEach((emp) => {
  //     const fields = [
  //       emp.employee_id.toString(),
  //       emp.name.toLowerCase(),
  //       emp.department.toLowerCase(),
  //       emp.job_title.toLowerCase(),
  //       emp.email.toLowerCase()
  //     ];

  //     let minPosition = Infinity;

  //     fields.forEach((field) => {
  //       const words = field.split(/\s+/);
  //       const position = words.indexOf(lowerTerm);

  //       if (position !== -1) {
  //         minPosition = Math.min(minPosition, position);
  //       }
  //     });

  //     if (minPosition !== Infinity) {
  //       if (!priorityMap.has(minPosition)) {
  //         priorityMap.set(minPosition, []);
  //       }
  //       priorityMap.get(minPosition)?.push(emp);
  //     }
  //   });

  //   // Sort results based on earliest position and flatten
  //   this.filteredEmployees = Array.from(priorityMap.entries())
  //     .sort((a, b) => a[0] - b[0]) // Sort by word position
  //     .flatMap(([, employees]) => employees);
  // }

  sortDirection: Record<string, boolean | undefined> = {};
  previousField: keyof Employee | null = null;
  sort(field: keyof Employee) {
    if (this.previousField !== null && this.previousField !== field)
      this.sortDirection[this.previousField] = undefined;
    const direction = (this.sortDirection[field] = !this.sortDirection[field])
      ? 1
      : -1;
    this.filteredEmployees.sort((a, b) => {
      if (field === 'employee_id' || field === 'salary') {
        return (parseInt(a[field], 10) - parseInt(b[field], 10)) * direction;
      }
      return (a[field] > b[field] ? 1 : -1) * direction;
    });
    this.previousField = field;
  }

  view(employeeId: string): void {
    this.router.navigate(['/view'], { queryParams: { id: employeeId } });
  }
}
