import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../employee.model';
import { EmployeeEditComponent } from 'src/app/edit-model/employee-edit/employee-edit.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css'],
})
export class EmployeeViewComponent implements OnInit {
  employee: Employee= {} as Employee;

  constructor(
      private dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
        this.employeeService.getEmployee().subscribe((data)=>{
          this.employee = data.find((emp) => emp.emp_id == id)|| ({} as Employee);
        });
    });
  }


    openDialog(employeeData: Employee) {
      const dialogRef = this.dialog.open(EmployeeEditComponent, {
        width: '800px',
        height: '500px',
        data: employeeData,
      });
    }
}
