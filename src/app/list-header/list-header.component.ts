import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.css'],
})
export class ListHeaderComponent implements OnInit {
  searchControl = new FormControl('');
  @Input() count:number=0;
  @Output() searchTerm = new EventEmitter<string>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((term) => {
      this.searchTerm.emit(term??''); 
    });
  }
}
