import { NgModule,Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { ListHeaderComponent } from './list-header/list-header.component';
import { ListTableComponent } from './list-table/list-table.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEmployeeComponent } from './add-employee/add-employee.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'view', component: ViewComponent },
  { path: 'add_employee', component: AddEmployeeComponent },
];

@NgModule({
  declarations: [AppComponent, ListComponent, ViewComponent,ListHeaderComponent,ListTableComponent,SidebarComponent],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent],
  providers:[EmployeeService]
})
export class AppModule {}
