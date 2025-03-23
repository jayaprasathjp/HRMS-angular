import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/hrms';
  private tokenKey = 'auth_token';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {}
  login(credentials: any) {
    let status=true;
    this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials)
      .pipe(
        catchError(error => {
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
          console.error("Login failed:", error.error?.message || error.message || "Unknown error");
status=false;
          return throwError(() => error);
        })
      )
      .subscribe(response => {
        sessionStorage.setItem(this.tokenKey, response.token);
        this.isLoggedInSubject.next(true);
        status=false;
        this.router.navigate(['/home']);
      });
      return status;
  }
  
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }
}
