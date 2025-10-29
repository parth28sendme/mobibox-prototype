import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparatedNumber',
  standalone: true
})
export class CommaSeparatedPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    
    const num = Number(value);
    if (isNaN(num)) {
      return value.toString();
    }
    
    return num.toLocaleString();
  }
}