import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSanitizeInput]'
})
export class SanitizeInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) 
  onInput(event: Event): void {
      
      const inputElement = this.el.nativeElement as HTMLInputElement;
      let sanitizedValue = inputElement.value;
      sanitizedValue = sanitizedValue.replace(/[<>\/'"`;(){}]/g, '');
    inputElement.value = sanitizedValue;
  }
}
