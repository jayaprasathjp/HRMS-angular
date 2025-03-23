import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef, ContentChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-project-list-header',
  templateUrl: './project-list-header.component.html',
  styleUrls: ['./project-list-header.component.css']
})
export class ProjectListHeaderComponent {
 searchControl = new FormControl('');
  @Output() searchTerm = new EventEmitter<string>();
  constructor(private cdr: ChangeDetectorRef){
// this.cdr.detach(); 
  }
  @ContentChild('searchCount') projected!: ElementRef;

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((term) => {
      this.searchTerm.emit(term??''); 
    });
  }
}
