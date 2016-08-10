import {Directive, ElementRef} from '@angular/core';
var pikaday = require('pikaday');

@Directive({
  selector: '[wzPikaday]'
})

export class WzPikaDayDirective {

  constructor(public element: ElementRef) {
    console.log(this.element.nativeElement);
    var picker = new pikaday({ field: this.element.nativeElement });
  }


}
