import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef, ContentChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListHeaderComponent implements OnInit {
  searchControl = new FormControl('');
  @Output() searchTerm = new EventEmitter<string>();
  constructor(private cdr: ChangeDetectorRef){
// this.cdr.detach(); 
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
