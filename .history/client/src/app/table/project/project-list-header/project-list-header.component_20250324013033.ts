import { Component } from '@angular/core';

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

  ngAfterContentInit() {
    console.log('Projected content:', this.projected.nativeElement.textContent);
  }
  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((term) => {
      this.searchTerm.emit(term??''); 
    });
  }
}
