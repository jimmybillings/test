import { Directive, ElementRef } from '@angular/core';
var clipboard = require('clipboard');

@Directive({
  selector: '[wzClipboard]'
})

export class WzClipBoardDirective {
  constructor(public element: ElementRef) {
    new clipboard(this.element.nativeElement);
  }
}
