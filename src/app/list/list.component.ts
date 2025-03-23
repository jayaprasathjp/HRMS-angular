import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})

export class ListComponent {
  term: string=""
  count:number=0;
  updateCount(newCount: number) {
    setTimeout(() => {
      this.count = newCount;
    });}
}
