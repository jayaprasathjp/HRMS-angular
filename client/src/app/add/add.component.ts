import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements AfterViewInit {
  @ViewChild(EmployeeAddComponent) EmployeeComponent!: EmployeeAddComponent;
  @ViewChild(ProjectAddComponent) ProjectComponent!: ProjectAddComponent;

  hasUnsavedChanges = false;
  employeeAdd: boolean = true;

  ngAfterViewInit(): void {
    this.employeeAdd = true;
  }

  tabChange(val: boolean) {
    if (this.EmployeeComponent?.isFormDirty() || this.ProjectComponent?.isFormDirty()) {
      Swal.fire({
        title: 'You have unsaved changes. Do you really want to leave?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        customClass: {
          popup: 'small-alert',
        }
      }).then((result) => {
        if (result.isConfirmed) { 
          this.employeeAdd = val;
        }
      });
    } else {
      this.employeeAdd = val;
    }
  }
  
  canDeactivate(): Promise<boolean> {
    if (this.EmployeeComponent?.isFormDirty() || this.ProjectComponent?.isFormDirty()) {
      return Swal.fire({
        title: 'You have unsaved changes. Do you really want to leave?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        customClass: {
          popup: 'small-alert',
        }
      }).then((result) => {
        return result.isConfirmed; 
      });
    }
    return Promise.resolve(true);
  }
}
