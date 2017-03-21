import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { PlayerState, PlayerSeekRequest } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-scrubber',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="readyToDisplay">
      <md-slider
        class="scrubber"
        min="0"
        max="{{ largestFrameNumber }}"
        value="{{ currentFrameNumber }}"
        (change)="onScrubberSliderChange()"
        (mouseover)="onScrubberMouseOver()"
        (mousemove)="onScrubberMouseMove($event)"
        (mouseout)="onScrubberMouseOut()">
      </md-slider>

      <md-slider
        *ngIf="inMarkerIsSet"
        [disabled]="true"
        class="marker in"
        min="0"
        max="{{ largestFrameNumber }}"
        value="{{ inMarkerFrameNumber }}"
        (click)="onInMarkerClick()"
        (mouseover)="onScrubberMouseOver()"
        (mousemove)="onScrubberMouseMove($event)"
        (mouseout)="onScrubberMouseOut()">
      </md-slider>

      <md-slider
        *ngIf="outMarkerIsSet"
        [disabled]="true"
        class="marker out"
        min="0"
        max="{{ largestFrameNumber }}"
        value="{{ outMarkerFrameNumber }}"
        (click)="onOutMarkerClick()"
        (mouseover)="onScrubberMouseOver()"
        (mousemove)="onScrubberMouseMove($event)"
        (mouseout)="onScrubberMouseOut()">
      </md-slider>

      <span *ngIf="hovering" class="hover-frame-display" [style.left.px]="hoverFrameDisplayPosition">
        {{ hoverFrame | timecode }}
      </span>
    </ng-container>
  `
})

export class ScrubberComponent {
  @Input() window: any;
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerSeekRequest> = new EventEmitter<PlayerSeekRequest>();

  private _hovering: boolean = false;
  private _hoverFrameDisplayPosition: number = 0;
  private _hoverFrame: Frame;

  constructor(private elementRef: ElementRef) { }

  public get readyToDisplay(): boolean {
    return this.durationIsSet && this.currentFrameIsSet;
  }

  public get largestFrameNumber(): number {
    return this.durationIsSet ? this.playerState.durationFrame.frameNumber - 1 : undefined;
  }

  public get currentFrameNumber(): number {
    return this.currentFrameIsSet ? this.playerState.currentFrame.frameNumber : undefined;
  }

  public get inMarkerIsSet(): boolean {
    return !!this.playerState && !!this.playerState.inMarkerFrame;
  }

  public get inMarkerFrameNumber(): number {
    return this.inMarkerIsSet ? this.playerState.inMarkerFrame.frameNumber : undefined;
  }

  public get outMarkerIsSet(): boolean {
    return !!this.playerState && !!this.playerState.outMarkerFrame;
  }

  public get outMarkerFrameNumber(): number {
    return this.outMarkerIsSet ? this.playerState.outMarkerFrame.frameNumber : undefined;
  }

  public onScrubberSliderChange(): void {
    this.request.emit({ type: 'SEEK_TO_FRAME', frame: this._hoverFrame });
  }

  public onScrubberMouseOver(): void {
    this._hovering = true;
  }

  public onScrubberMouseOut(): void {
    this._hovering = false;
  }

  public onScrubberMouseMove(event: any): void {
    this.updateHoverFrameDisplayWith(event.pageX);
  }

  public onInMarkerClick(): void {
    this.request.emit({ type: 'SEEK_TO_MARKER', markerType: 'in' });
  }

  public onOutMarkerClick(): void {
    this.request.emit({ type: 'SEEK_TO_MARKER', markerType: 'out' });
  }

  public get hovering(): boolean {
    return this._hovering;
  }

  public get hoverFrameDisplayPosition(): number {
    return this._hoverFrameDisplayPosition;
  }

  public get hoverFrame(): Frame {
    return this._hoverFrame;
  }

  private get durationIsSet(): boolean {
    return !!this.playerState && !!this.playerState.durationFrame;
  }

  private get currentFrameIsSet(): boolean {
    return !!this.playerState && !!this.playerState.currentFrame;
  }

  private updateHoverFrameDisplayWith(pageMouseX: number): void {
    const relativeMouseX: number = pageMouseX - this.scrubberPageOffset;
    const children: any[] = Array.from(this.elementRef.nativeElement.children);
    const scrubber: any = this.findByClassNameIn(children, 'scrubber');
    const frameDisplay: any = this.findByClassNameIn(children, 'hover-frame-display');

    this.updateHoverFrameWith(relativeMouseX, scrubber);
    this.updateHoverFrameDisplayPositionWith(relativeMouseX, scrubber, frameDisplay);
  }

  private get scrubberPageOffset(): number {
    let totalOffset = 0;
    let element = this.elementRef.nativeElement;

    while (element) {
      totalOffset += element.offsetLeft;
      element = element.offsetParent;
    }

    return totalOffset;
  }

  private findByClassNameIn(elementChildren: any, className: string): any {
    return elementChildren.find((child: any) => Array.from(child.classList).indexOf(className) > -1);
  }

  private updateHoverFrameWith(relativeMouseX: number, scrubber: any): void {
    const scrubberTrack: any = this.findByClassNameIn(Array.from(scrubber.children), 'md-slider-track');
    const scrubberTrackWidth: number = scrubberTrack.offsetWidth;
    const newFrameNumber: number = Math.round(relativeMouseX * this.playerState.durationFrame.frameNumber / scrubberTrackWidth);

    this._hoverFrame = new Frame(this.playerState.framesPerSecond).setFromFrameNumber(newFrameNumber);
  }

  private updateHoverFrameDisplayPositionWith(relativeMouseX: number, scrubber: any, frameDisplay: any): void {
    const computedStyle: any = this.window.getComputedStyle(frameDisplay);
    const width: number =
      parseFloat(computedStyle.getPropertyValue('width'))
      + parseFloat(computedStyle.getPropertyValue('border-left-width'))
      + parseFloat(computedStyle.getPropertyValue('border-right-width'))
      + parseFloat(computedStyle.getPropertyValue('padding-left'))
      + parseFloat(computedStyle.getPropertyValue('padding-right'));

    const unconstrainedPosition: number = relativeMouseX - (width / 2);
    const minimumPosition: number = 0;
    const maximumPosition: number = scrubber.offsetWidth - width;

    this._hoverFrameDisplayPosition = this.constrainTo(minimumPosition, maximumPosition, unconstrainedPosition);
  }

  private constrainTo(minimumPosition: number, maximumPosition: number, position: number) {
    return Math.max(minimumPosition, Math.min(maximumPosition, position));
  }
}
