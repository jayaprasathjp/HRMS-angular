export interface Employee {
    emp_id: any;
    name: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    project: string;
    reports_to: string;
    gender:string;
  }
export interface Project {
    name: string;
    description: string;
    lead: string;
    manager: string;
  }
export interface ProjectSearchModel {
    name: string;
    lead: string;
    manager: string;
    global_term:string;
  }
  export interface EmployeeSearchModel {
    name: string;
    role: string;
    project: string;
    reports_to: string;
    emp_id: string;
    global_term:string;
  }
  