import { FormControl, FormGroup, Validators } from '@angular/forms';

export function createEmployeeForm(data: any = {}) {
  
  return new FormGroup({
    emp_id: new FormControl(data.emp_id || '',[Validators.required,Validators.pattern('^[0-9]+$')]),
    name: new FormControl(data.name || '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z. ]*$'),
    ]),
    email: new FormControl(data.email || '', [
      Validators.required,
      Validators.email,
    ]),
    gender: new FormControl(data.gender || 'Male', Validators.required),
    phone: new FormControl(data.phone || '', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    reports_to: new FormControl(data.reports_to || '',Validators.required),
    department: new FormControl(data.department || '', Validators.required),
    role: new FormControl(data.role || '', Validators.required),
    project: new FormControl(data.project || '', Validators.required)
  });
}
export function createProjectForm(data: any = {}) {
  return new FormGroup({
    name: new FormControl(data.name || '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z. ]*$'),
    ]),
    description: new FormControl(data.description || '', Validators.required),
    manager: new FormControl(data.manager || '', Validators.required),
    lead: new FormControl(data.lead),
  });
}
