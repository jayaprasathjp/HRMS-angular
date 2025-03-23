import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Employee, Project } from './employee.model';
import { LoaderService } from './loader/loader.service';
import Toastify from 'toastify-js';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5000/hrms/employee';
  employeeSubject = new BehaviorSubject<Employee[]>([]);
  projectSubject = new BehaviorSubject<Project[]>([]);

  constructor(private http: HttpClient,private loaderService:LoaderService) {}
  // private refreshSubject = new BehaviorSubject<boolean>(false);
  // refresh$ = this.refreshSubject.asObservable();
  // triggerRefresh() {
  //   this.refreshSubject.next(true);
  // }
  fetchEmployee(): void {
    this.loaderService.show();
    this.http.get<Employee[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching employees:', error);
        this.loaderService.hide();
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
        return throwError(() => error); 
      })
    ).subscribe((data) => {
      this.employeeSubject.next(data);
      this.loaderService.hide();
    });
  }
  
  postEmployee(data: Employee): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  patchEmployee(data: Employee): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(this.apiUrl+'/'+data.emp_id, data, { headers });
  }
  getEmployee(): Observable<Employee[]> {
    return this.employeeSubject.asObservable();
  }
  getSelectList(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl+'/hie').pipe(
      catchError((error) => {
        console.error('Error fetching List:', error);
        return throwError(() => error);
      })
    );
  }
  deleteEmployee(emp_id:string):Observable<any>{
    return this.http.delete(this.apiUrl+`/${emp_id}`);
  }
  getOrgChart():Observable<any>{
    return this.http.get(this.apiUrl+'/org-chart');
  }
  generatePDF(tableData: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate-pdf`, tableData, { responseType: 'blob' });
  }
  
}