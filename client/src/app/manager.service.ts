import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { LoaderService } from './loader/loader.service';
import Toastify from 'toastify-js';
@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private apiUrl = 'http://localhost:5000/hrms/manager';
  managerSubject = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient, private loaderService: LoaderService) {}
  fetchManager(): void {
    this.loaderService.show();
    this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching managers:', error);
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
        this.managerSubject.next(data);
        this.loaderService.hide();
      });
  }

  getManager(): Observable<any[]> {
    return this.managerSubject.asObservable();
  }

}
