import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../employee.model';
import { EmployeeService } from '../../employee.service';
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';
import { CanComponentDeactivate } from '../../can-deactivate.guard';
import { createEmployeeForm } from '../../form.validators';
@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements CanComponentDeactivate  {
    lastId: string = '0';
    hasUnsavedChanges = false;
    employeeForm = createEmployeeForm(this.data);
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
    constructor( private cdr:ChangeDetectorRef,
      private employeeService: EmployeeService,
      public dialogRef: MatDialogRef<EmployeeEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Employee
    ) {
      this.dialogRef.disableClose = true;
    }
    ngOnInit(): void {
      this.hasUnsavedChanges = true;
      this.employeeForm.controls['project'].setValue(this.data.project); 
      this.employeeForm.controls['role'].setValue(this.data.role); 
      this.employeeService.getSelectList().subscribe({
        next: (data) => {
          this.managers = data;
          this.employeeForm.controls['reports_to'].setValue(data.find((m:any) => m.name === this.data.reports_to).id);
          this.onManagerChange(data.find((m:any) => m.name === this.data.reports_to).id)
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
  
    }
    canDeactivate(): boolean {
      return this.hasUnsavedChanges
        ? confirm('You have unsaved changes. Do you really want to leave?')
        : true;
    }
    onManagerChange(managerId: any) {
      
      const selectedManager = this.managers.find((m:any) => m.id === managerId);
      this.filteredProjects = selectedManager ? selectedManager.projects : [];
    
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
          confirmButtonText: 'Update',
        }).then((result) => {
          if (result.isConfirmed) {
            this.employeeService.patchEmployee(employeeData).subscribe(
              (response) => {
                this.employeeService.fetchEmployee();
              this.cdr.detectChanges();
                this.dialogRef.close();
                Swal.fire({
                  title: 'Updated!',
                  text: 'Employee data has been Updated.',
                  icon: 'success',
                });
                console.log('Updated:', response);
              },
              (error) => {
                Toastify({
                  text: 'Server request failed!',
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  duration:10000,
                  gravity: 'right',
                  position: 'right',
                  transition: "Bounce",
                  backgroundColor: 'red',
                  close:true
                }).showToast();
                
                console.error('Update error:', error)
              }
            );
  
          }
        });
      } else {
        console.log('Form is invalid');
      }
    }
    closeDialog() {
      Swal.fire({
        title: 'Are you sure?',
        text:'Modified details will be lost if left without updating',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Close',
      }).then((result) => {
        if (result.isConfirmed) {
              this.dialogRef.close();
        }
      });
    }
  }
