import { Component} from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from './loader.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent  {
  
  color = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate'; 
   value = 50;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService) {
    }
}
