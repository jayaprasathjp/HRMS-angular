import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  employee: any = {};

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      this.employeeService.getEmployee().subscribe((data) => {
        this.employee = data.find((emp) => emp.id == id);
      });
    });
  }
}
