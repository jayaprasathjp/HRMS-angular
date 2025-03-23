import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { EmployeeListHeaderComponent } from './table/employee/employee-list-header/employee-list-header.component';
import { EmployeeListTableComponent } from './table/employee/employee-list-table/employee-list-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeResolver } from './employee.resolver';
import { LoaderComponent } from './loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { LoaderInterceptor } from './interceptor.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from './login/login.component';
import { AuthGuard, LoginGuard } from './auth.guard';
import { JwtModule } from '@auth0/angular-jwt';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { CourtesyTitlePipe } from './employee.pipe';
import { SanitizeInputDirective } from './login/sanitize-input.directive';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectListComponent } from './table/project/project-list/project-list.component';
import { ProjectListHeaderComponent } from './table/project/project-list-header/project-list-header.component';
import { ProjectListTableComponent } from './table/project/project-list-table/project-list-table.component';
import { ProjectViewComponent } from './view/project-view/project-view.component';
import { EmployeeViewComponent } from './view/employee-view/employee-view.component';
import { LeaveComponent } from './leave/leave.component';
import { AddComponent } from './add/add.component';
import { EmployeeAddComponent } from './add/employee-add/employee-add.component';
import { ProjectAddComponent } from './add/project-add/project-add.component';
import { EmployeeEditComponent } from './edit-model/employee-edit/employee-edit.component';
import { ProjectEditComponent } from './edit-model/project-edit/project-edit.component';
import { OrgChartComponent } from './org-chart/org-chart.component';
import { EmployeeOrgChartComponent } from './src/app/org-chart/employee-org-chart/employee-org-chart.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'employee-list',
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project-list',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employee-view',
    component: EmployeeViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'org-chart',
    component: OrgChartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'project-view',
    component: ProjectViewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'leave', component: LeaveComponent, canActivate: [AuthGuard] },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'add',
    component: AddComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  { path: '**', redirectTo: 'login' },
];
export function tokenGetter() {
  return sessionStorage.getItem('auth_token');
}
@NgModule({
  declarations: [
    SanitizeInputDirective,
    CourtesyTitlePipe,
    AppComponent,
    EmployeeListComponent,
    EmployeeListHeaderComponent,
    EmployeeListTableComponent,
    LoaderComponent,
    LoginComponent,
    ProjectListComponent,
    ProjectListHeaderComponent,
    ProjectListTableComponent,
    ProjectViewComponent,
    EmployeeViewComponent,
    LeaveComponent,
    AddComponent,
    EmployeeAddComponent,
    ProjectAddComponent,
    EmployeeEditComponent,
    ProjectEditComponent,
    OrgChartComponent,
    EmployeeOrgChartComponent,
  ],
  imports: [ FormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatProgressSpinnerModule,
    JwtModule.forRoot({
      config: { tokenGetter },
    }),
  ],
  exports: [
    SanitizeInputDirective,
    CourtesyTitlePipe,
    RouterModule,
    MatIconModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    EmployeeService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
})
export class AppModule {}
