import { Directive, ElementRef, Input } from '@angular/core';
var pikaday = require('pikaday');

@Directive({
  selector: '[wzPikaday]'
})

export class WzPikaDayDirective {
  private picker: any;

  constructor(public element: ElementRef) {
    this.picker = new pikaday({ field: this.element.nativeElement });
  }

  @Input()
  set maxDate(dateString: string) {
    this.picker.setMaxDate(dateString ? this.convertToDateInstance(dateString) : null);
  }

  @Input()
  set minDate(dateString: string) {
    this.picker.setMinDate(dateString ? this.convertToDateInstance(dateString) : null);
  }

  private convertToDateInstance(dateString: string): Date {
    // Thanks to commenter "jacquesporveau" at https://github.com/dbushell/Pikaday/issues/39.
    const utcDate = new Date(dateString);
    const offsetInMinutes = utcDate.getTimezoneOffset();
    const offsetInMilliseconds = offsetInMinutes * 60 * 1000;
    const fudgeFactor = 500;

    return new Date(utcDate.getTime() + offsetInMilliseconds + fudgeFactor);
  }
}
