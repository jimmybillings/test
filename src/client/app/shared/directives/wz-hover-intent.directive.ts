import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

const previewHeight: number = 380;  // How tall the speed preview dialog is
const previewWidth: number = 560;   // How wide the speed preivew dialog is
const padding: number = 20;         // how much room we want on each side of the speed preview
const delay: number = 333;          // How long we want to wait before showing the preview

@Directive({ selector: '[hoverIntent]' })
export class WzHoverIntentDirective {
  @Output() public showPreview: EventEmitter<any> = new EventEmitter();
  @Output() public hidePreview: EventEmitter<any> = new EventEmitter();
  private timeout: any;
  private viewport: any;

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
  private get previewPosition(): any {
    let x: number = this.determineHorizontalPreviewPlacement;
    let y: number = this.determineVerticalPreviewPlacement;
    return { x, y };
  }

  // Returns an x coordinate based on the position of the element that was hovered upon
  // if there is no room to the right, it shifts the preview back by its width, and the width of the hovered element
  private get determineHorizontalPreviewPlacement(): number {
    if (this.roomToTheRight) {
      return this.viewport.right + (padding / 2);
    } else {
      return this.viewport.right - previewWidth - this.viewport.width - (padding / 2);
    }
  }

  // Returns a y coordinate based on the position of the element that was hovered upon
  // if there is not room on the bottom, it shifts the preview up by its height, and half the height of the hovered element
  private get determineVerticalPreviewPlacement(): number {
    if (this.roomAbove && this.roomBelow) {
      return this.viewport.top - (previewHeight / 3);
    } else if (!this.roomBelow) {
      return window.innerHeight - padding - previewHeight;
    } else {
      return 0 + padding;
    }
  }

  private get roomAbove(): boolean {
    return 0 + (this.viewport.top + (this.viewport.height / 3)) >= (previewHeight + padding);
  }

  // Returns true if there is room to the right of the hovered element
  private get roomToTheRight(): boolean {
    return (window.innerWidth - this.viewport.right) >= (previewWidth + padding);
  }

  // Returns true if there is room below the hovered element
  // Calcualated from the window's height, viewport
  private get roomBelow(): boolean {
    return window.innerHeight - (this.viewport.top + (this.viewport.height / 3)) >= (previewHeight + padding);
  }
}
