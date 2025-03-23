import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courtesyTitle'
})
export class CourtesyTitlePipe implements PipeTransform {

  transform(name: string, gender: string): string {
    if (!name) return '';

    let title = '';
    
    if (gender === 'male') {
      title = 'Mr.';
    } else if (gender === 'female') {
      title =  'Ms.';
    }

    return `${title} ${name}`;
  }
}
