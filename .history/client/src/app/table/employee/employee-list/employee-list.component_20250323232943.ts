import { Component } from '@angular/core';
import { EmployeeListHeaderComponent } from '../employee-list-header/employee-list-header.component';
@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  import:[EMpl]
})

export class EmployeeListComponent {
  term: string=""
  count:number=0;
  updateCount(newCount: number) {
    setTimeout(() => {
      this.count = newCount;
    });}
}
