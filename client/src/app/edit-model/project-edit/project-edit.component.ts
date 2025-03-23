import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee, Project } from '../../employee.model';
import { ProjectService } from '../../project.service';
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';
import { CanComponentDeactivate } from '../../can-deactivate.guard';
import { createProjectForm } from '../../form.validators';
import { ManagerService } from 'src/app/manager.service';
import { EmployeeService } from 'src/app/employee.service';
@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
})
export class ProjectEditComponent implements CanComponentDeactivate {
  hasUnsavedChanges = false;
  projectForm = createProjectForm(this.data);
  managers: any[] = [];
  TeamMembers: any[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private projectService: ProjectService,
    private managerService: ManagerService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<ProjectEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.hasUnsavedChanges = true;
    this.employeeService.getEmployee().subscribe((data) => {
      this.TeamMembers = data.filter((emp) => {
        return emp.project == this.data.name;
      });
    });
    this.managerService.getManager().subscribe((data) => {
      this.managers = data;
    });
    const selectedManager = this.managers.find(
      (m) => m.name === this.data.manager
    );
    const selectedLead = this.TeamMembers.find(
      (m) => m.name === this.data.lead
    );
    this.projectForm.controls['manager'].setValue(
      selectedManager ? selectedManager.emp_id : null
    );
    this.projectForm.controls['lead'].setValue(
      selectedLead ? selectedLead.emp_id : null
    );
  }

  canDeactivate(): boolean {
    return this.hasUnsavedChanges
      ? confirm('You have unsaved changes. Do you really want to leave?')
      : true;
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const projectData: Project = {
        description: this.projectForm.get('description')?.value || '',
        name: this.projectForm.get('name')?.value || '',
        manager: this.projectForm.get('manager')?.value || '',
        lead: this.projectForm.get('lead')?.value || '',
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
          this.projectService.patchProject(projectData).subscribe(
            (response) => {
              this.projectService.fetchProject();
              this.cdr.detectChanges();
              this.dialogRef.close();
              Swal.fire({
                title: 'Updated!',
                text: 'Project data has been Updated.',
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
                duration: 10000,
                gravity: 'right',
                position: 'right',
                transition: 'Bounce',
                backgroundColor: 'red',
                close: true,
              }).showToast();

              console.error('Update error:', error);
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
      text: 'Modified details will be lost if left without updating',
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
