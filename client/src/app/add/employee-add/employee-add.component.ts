import { Component } from '@angular/core';
import { Employee } from 'src/app/employee.model';
import { EmployeeService } from 'src/app/employee.service';
import { createEmployeeForm } from 'src/app/form.validators';
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent {
    hasUnsavedChanges = false;
    employeeForm = createEmployeeForm();
    employeeAdd:boolean=true;
    managers:any=[];
    selectedManager: any = null;
    filteredProjects: string[] = [];
    roles=[
      "Senior Applications Developer",
      "Systems Programming Analyst",
      "Senior Data Engineer",
      "Intermediate Apps Developer",
      "Data Engineer",
      "Data & Business Intelligence A",
      "Data Scientist",
      "Senior Machine Learning Engineer",
      "Applications Devt Associate",
      "INTERN"
    ]    
    constructor(private employeeService: EmployeeService) {}
    ngOnInit(): void {
      this.employeeAdd=true;
      this.employeeService.getSelectList().subscribe({
        next: (data) => {
          this.managers = data;
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
      this.hasUnsavedChanges = true;
    }
  
    isFormDirty(): boolean {
      if(this.employeeForm.controls['emp_id'].value!=''||this.employeeForm.controls['name'].value!=''||this.employeeForm.controls['email'].value!=''||this.employeeForm.controls['phone'].value!=''||this.employeeForm.controls['department'].value!=''||this.employeeForm.controls['role'].value!=''||this.employeeForm.controls['reports_to'].value!=''||this.employeeForm.controls['project'].value!='')
      return true;
    return false;
    }

    onManagerChange(managerId: any) {
      const selectedManager = this.managers.find((m:any) => m.id === managerId);
      this.filteredProjects = selectedManager ? selectedManager.projects : [];
      this.employeeForm.controls['project'].setValue(null); 
    }
    
    onSubmit() {
   
      if (this.employeeForm.valid) {
        const employeeData: Employee = {
          emp_id: this.employeeForm.get('emp_id')?.value || '',
          name: this.employeeForm.get('name')?.value || '',
          email: this.employeeForm.get('email')?.value || '',
          gender: this.employeeForm.get('gender')?.value || '',
          role: this.employeeForm.get('role')?.value || '',
          phone: this.employeeForm.get('phone')?.value || '',
          department: this.employeeForm.get('department')?.value || '',
          reports_to: this.employeeForm.get('reports_to')?.value || '',
          project: this.employeeForm.get('project')?.value || '',
        };
        Swal.fire({
          title: 'Are you sure?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Add Employee',
        }).then((result) => {
          if (result.isConfirmed) {
            this.employeeService.postEmployee(employeeData).subscribe(
              (response) => {
                this.employeeService.fetchEmployee();
  
                this.employeeForm.reset();
                this.employeeForm.controls['gender'].setValue('male');
                this.employeeForm.markAsUntouched();
                console.log('Data sent successfully:', response);
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
                  close: true,
                }).showToast();
                console.error('Error sending data:', error);
              }
            );
            Swal.fire({
              title: 'Added',
              text: 'Employee added.',
              icon: 'success',
            });
          }
        });
      } else {
        console.log('Form is invalid');
      }
      this.hasUnsavedChanges = true;
    }
  }