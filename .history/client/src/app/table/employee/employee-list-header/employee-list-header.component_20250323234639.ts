import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef, ContentChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-list-header',
  templateUrl: './employee-list-header.component.html',
  styleUrls: ['./employee-list-header.component.css'],
})
export class EmployeeListHeaderComponent implements OnInit {
  searchControl = new FormControl('');
  @Output() searchTerm = new EventEmitter<string>();
  constructor(private cdr: ChangeDetectorRef){
  }
  @ContentChild('searchCount') projected!: ElementRef;

  ngAfterContentInit() {
    console.log('Projected content:', this.projected.nativeElement.textContent);
  }
  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((term) => {
      this.searchTerm.emit(term??''); 
    });
  }
}
