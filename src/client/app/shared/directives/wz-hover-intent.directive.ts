import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { Viewport, Coordinates } from '../interfaces/event.interface';

const previewWidth: number = 420;     // How wide the speed preview dialog is
const previewHeight: number = 300;    // How tall the speed preview dialog is
const horizontalPadding: number = 10; // How much room we want on each side of the speed preview
const verticalPadding: number = 20;   // How much room we want above and below the preview
const delay: number = 333;            // How long we want to wait before showing the preview

@Directive({ selector: '[hoverIntent]' })
export class WzHoverIntentDirective {
  @Output() public showPreview: EventEmitter<any> = new EventEmitter();
  @Output() public hidePreview: EventEmitter<any> = new EventEmitter();
  private timeout: any;
  private viewport: Viewport;

  @HostListener('mouseenter', ['$event']) public onMouseEnter($event: any): void {
    if (window.innerWidth <= previewWidth) return;
    this.viewport = $event.currentTarget.getBoundingClientRect();
    this.timeout = setTimeout(() => {
      this.showPreview.emit(this.previewPosition);
    }, delay);
  }

  @HostListener('mouseleave', ['$event']) public onMouseLeave(): void {
    clearTimeout(this.timeout);
    this.hidePreview.emit();
  }

  // Determines the x and y coordinate that the preview's top left corner should start at 
  private get previewPosition(): Coordinates {
    let x: number = this.determineHorizontalPreviewPlacement;
    let y: number = this.determineVerticalPreviewPlacement;
    return { x, y };
  }

  // Returns an x coordinate based on the position of the element that was hovered upon
  // if there is no room to the right, it shifts the preview back by its width, and the width of the hovered element
  private get determineHorizontalPreviewPlacement(): number {
    if (this.roomToTheRight) {
      return this.viewport.right + horizontalPadding;
    } else {
      return this.viewport.right - previewWidth - this.viewport.width - horizontalPadding;
    }
  }

  // Returns a y coordinate based on the position of the element that was hovered upon
  // if there is not room on the bottom, it shifts the preview up by its height, and half the height of the hovered element
  private get determineVerticalPreviewPlacement(): number {
    if (this.roomBelow && this.roomAbove) {
      return this.viewport.top - (previewHeight / 3);
    } else if (!this.roomBelow) {
      return window.innerHeight - previewHeight - verticalPadding;
    } else {
      return 0 + verticalPadding;
    }
  }

  // Returns true if there is at least 20px to the right of the hovered element
  private get roomToTheRight(): boolean {
    return window.innerWidth - this.viewport.right - previewWidth >= horizontalPadding;
  }

  // Returns true if there is at least 20px above the hovered element 
  private get roomAbove(): boolean {
    return 0 + this.viewport.top - (previewHeight / 3) >= verticalPadding;
  }

  // Returns true if there is at least 20px below the hovered element
  private get roomBelow(): boolean {
    return window.innerHeight - (this.viewport.top - (previewHeight / 3) + previewHeight) >= verticalPadding;
  }
}
