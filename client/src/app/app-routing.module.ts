import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth-callback',
  template: `<p>Authenticating...</p>`,
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        // Send code to backend for token exchange
        this.http
  .get(`http://localhost:3000/auth/github?code=${code}`)
  .subscribe((res: any) => {
    sessionStorage.setItem('access_token', res.access_token);
    this.router.navigate(['/']);
  });

      }
    });
  }
}
