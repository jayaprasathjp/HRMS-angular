import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Project } from './employee.model';
import { LoaderService } from './loader/loader.service';
import Toastify from 'toastify-js';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:5000/hrms/project';
  projectSubject = new BehaviorSubject<Project[]>([]);
  constructor(private http: HttpClient, private loaderService: LoaderService) {}
  fetchProject(): void {
    this.loaderService.show();
    this.http
      .get<Project[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching projects:', error);
          this.loaderService.hide();
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
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        this.projectSubject.next(data);
        this.loaderService.hide();
      });
  }
  postProject(data: Project): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  patchProject(data: Project): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(this.apiUrl+'/'+data.name, data, { headers });
  }
  getProject(): Observable<Project[]> {
    return this.projectSubject.asObservable();
  }

  deleteProject(name: string): Observable<any> {
    return this.http.delete(this.apiUrl+`/${name}`);
  }

  generatePDF(tableData: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate-pdf`, tableData, { responseType: 'blob' });
  }
}
