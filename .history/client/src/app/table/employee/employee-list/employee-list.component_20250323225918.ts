import { Component } from '@angular/core';

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./list.component.css'],
  
})

export class EmployeeListComponent {
  term: string=""
  count:number=0;
  updateCount(newCount: number) {
    setTimeout(() => {
      this.count = newCount;
    });}
}
