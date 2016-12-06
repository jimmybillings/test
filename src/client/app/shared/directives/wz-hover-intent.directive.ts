import { Directive, ElementRef, Renderer, HostListener, Output, EventEmitter } from '@angular/core';

const previewHeight: number = 380; // How tall the speed preview dialog is
const previewWidth: number = 560; // How wide the speed preivew dialog is
const padding: number = 10; // how much room we want on each side of the speed preview

@Directive({ selector: '[hoverIntent]' })
export class WzHoverIntentDirective {
  // private cX: number;
  // private cY: number;
  // private pX: number;
  // private pY: number;
  @Output() public showPreview: EventEmitter<any> = new EventEmitter();
  @Output() public hidePreview: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef, private renderer: Renderer) { }

  @HostListener('mouseenter', ['$event']) onMouseEnter($event: any) {
    this.determinePreviewPosition($event);
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave() {
    this.hidePreview.emit();
  }

  private determinePreviewPosition(event: any): void {
    let viewport: any = event.currentTarget.getBoundingClientRect();
    let x: number = this.determineHorizontalPreviewPlacement(viewport);
    let y: number = this.determineVerticalPreviewPlacement(viewport);
    this.showPreview.emit({ x, y });
  }

  // Returns an x coordinate based on the position of the element that was hovered upon
  // if there is no room to the right, it shifts the preview back by its width, and the width of the hovered element
  private determineHorizontalPreviewPlacement(viewport: any): number {
    if (this.roomToTheRight(viewport.right)) {
      return viewport.right - previewWidth - viewport.width;
    } else {
      return viewport.right;
    }
  }

  // Returns a y coordinate based on the position of the element that was hovered upon
  // if there is not room on the bottom, it shifts the preview up by its height, and half the height of the hovered element
  private determineVerticalPreviewPlacement(viewport: any): number {
    if (this.roomBelow(viewport)) {
      return (viewport.bottom - (viewport.height / 2));
    } else {
      return viewport.bottom - (viewport.height / 2) - previewHeight;
    }
  }

  // Returns true if there is room to the right of the hovered element
  private roomToTheRight(viewportRight: number): boolean {
    return (window.innerWidth - viewportRight) <= (previewWidth + padding);
  }

  // Returns true if there is room below the hovered element
  private roomBelow(viewport: any): boolean {
    return window.innerHeight - (viewport.bottom - (viewport.height / 2)) >= (previewHeight + padding);
  }

  // Skip for now to meet AC of CRUX-1252
  // @HostListener('mousemove', ['$event']) OnMouseMove($event: any) {
  //   this.determineIntent($event);
  // }

  // private determineIntent(event: any): void {
  //   this.cX = event.clientX;
  //   this.cY = event.clientY;
  //   if (Math.abs(this.pX - this.cX) + Math.abs(this.pY - this.cY) === 0) {
  //     console.log('they want a speedview');
  //   }
  //   this.pX = this.cX;
  //   this.pY = this.cY;
  // }
}
