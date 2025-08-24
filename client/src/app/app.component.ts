import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { EmployeeService } from './employee.service';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginComponent } from './login/login.component';
import { ProjectSearchModel } from './employee.model';
import { ProjectService } from './project.service';
import { ManagerService } from './manager.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('loginTemplate') loginTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  isLoggedIn = true;
  isSidenavOpen = true;
  current: string = 'HRMS TOOL';
  constructor(
    private router: Router,
    public authService: AuthService,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private managerService: ManagerService,
    private activatedRoute: ActivatedRoute
  ) {
    // this.cdr.detach();

    this.router.events.subscribe(() => {
      if (this.router.url === '/employee-list') this.current = 'EMPLOYEE LIST';
      else if (this.router.url === '/project-list')
        this.current = 'Project LIST';
      else if (this.router.url === '/add') this.current = 'ADD';
      else if (this.activatedRoute.snapshot.queryParams['id']) {
        this.current = 'VIEW EMPLOYEE';
      } else if (this.router.url === '/home') {
        this.current = 'HRMS TOOL';
      } else if (this.router.url === '/leave') {
        this.current = 'LEAVE';
      } else if (this.router.url === '/org-chart/employee-tree') {
        this.current = 'EMPLOYEE TREE';
      }
      else if (this.router.url === '/org-chart/project-tree') {
        this.current = 'PROJECT TREE';
      }
    });
  }
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (!this.isLoggedIn) {
        this.router.navigate(['/login']);
        setTimeout(() => {
          this.container.createEmbeddedView(this.loginTemplate);
        });
      } else {
        this.employeeService.fetchEmployee();
        this.projectService.fetchProject();
        this.managerService.fetchManager();
        this.container.clear();
      }
    });
  }
  toggleSidenav() {
    this.sidenav.toggle();
  }
}
