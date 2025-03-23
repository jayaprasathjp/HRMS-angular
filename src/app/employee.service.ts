import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/data';
  private employeeSubject = new BehaviorSubject<Employee[]>([]);

  constructor(private http: HttpClient) {}

  fetchEmployee(): void {
      this.http.get<Employee[]>(this.apiUrl).subscribe((data) => {
        this.employeeSubject.next(data);
      });
  }

  getEmployee(): Observable<Employee[]> {
    return this.employeeSubject.asObservable(); 
  }
}
