import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
@Injectable({
  providedIn: 'root',
})
export class EmployeeResolver implements Resolve<any> {
  constructor(private employeeService: EmployeeService) {}

  resolve(): Observable<Employee[]> {
    return this.employeeService.employeeSubject.asObservable();
  }
}
