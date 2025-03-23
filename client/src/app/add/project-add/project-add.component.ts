import { Component } from '@angular/core';
import {  Project } from 'src/app/employee.model';
import { createProjectForm } from 'src/app/form.validators';
import { ManagerService } from 'src/app/manager.service';
import { ProjectService } from 'src/app/project.service';
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent {
    hasUnsavedChanges = false;
    projectForm = createProjectForm();
    
  projects:Project[]=[]
  managers:any[]=[]
  constructor(
     private projectService: ProjectService,
     private managerService: ManagerService
   ) {}
    ngOnInit(): void {
      this.projectService.getProject().subscribe((data) => {
        this.projects = data;
      });
      this.managerService.getManager().subscribe((data) => {
        this.managers = data;
        
      });

      this.hasUnsavedChanges = true;
    }
  
    isFormDirty(): boolean {
      if(this.projectForm.controls['name'].value!=''||this.projectForm.controls['description'].value!=''||this.projectForm.controls['manager'].value!='')
        return true;
      return false;
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
          confirmButtonText: 'Add Project',
        }).then((result) => {
          if (result.isConfirmed) {
            this.projectService.postProject(projectData).subscribe(
              (response) => {
                this.projectService.fetchProject();
                this.projectForm.reset();
                this.projectForm.markAsUntouched();
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
              text: 'Project added.',
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