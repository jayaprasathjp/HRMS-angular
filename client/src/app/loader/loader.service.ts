import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({  providedIn: 'root'})
export class LoaderService {
    isLoading = new BehaviorSubject<boolean>(false);
    show() {
        this.isLoading.next(true);
    }
    hide() {
        this.isLoading.next(false);
    }
}