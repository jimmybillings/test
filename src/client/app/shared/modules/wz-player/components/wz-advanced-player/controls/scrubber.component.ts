import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-scrubber',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="playerState.durationFrame && playerState.currentFrame">
      <md-slider
        class="scrubber"
        min="0"
        max="{{ largestFrameNumber }}"
        value="{{ playerState.currentFrame.frameNumber }}"
        (change)="onScrubberSliderChange($event)"
        (mouseover)="onScrubberMouseOver()"
        (mousemove)="onScrubberMouseMove($event)"
        (mouseout)="onScrubberMouseOut()">
      </md-slider>

      <md-slider
        *ngIf="playerState.inMarkerFrame"
        [disabled]="true"
        class="marker in"
        min="0"
        max="{{ largestFrameNumber }}"
        value="{{ playerState.inMarkerFrame.frameNumber }}"
        (click)="onInMarkerClick()"
        (mouseover)="onScrubberMouseOver()"
        (mousemove)="onScrubberMouseMove($event)"
        (mouseout)="onScrubberMouseOut()">
      </md-slider>

      <md-slider
        *ngIf="playerState.outMarkerFrame"
        [disabled]="true"
        class="marker out"
        min="0"
        max="{{ largestFrameNumber }}"
        value="{{ playerState.outMarkerFrame.frameNumber }}"
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
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public hovering: boolean = false;
  public hoverFrameDisplayPosition: number = 0;
  public hoverFrame: Frame;

  constructor(private elementRef: ElementRef) { }

  public get largestFrameNumber(): number {
    return this.playerState.durationFrame.frameNumber - 1;
  }

  public onScrubberSliderChange(event: any): void {
    this.request.emit({ type: PlayerRequestType.SeekToFrame, payload: { frame: this.hoverFrame } });
  }

  public onScrubberMouseOver(): void {
    this.hovering = true;
  }

  public onScrubberMouseMove(event: any): void {
    this.updateHoverFrameDisplayWith(event.pageX);
  }

  public onScrubberMouseOut(): void {
    this.hovering = false;
  }

  public onInMarkerClick(): void {
    this.request.emit({ type: PlayerRequestType.SeekToInMarker });
  }

  public onOutMarkerClick(): void {
    this.request.emit({ type: PlayerRequestType.SeekToOutMarker });
  }

  private updateHoverFrameDisplayWith(pageMouseX: number): void {
    const relativeMouseX = pageMouseX - this.scrubberPageOffset;
    const children = Array.from(this.elementRef.nativeElement.children);
    const scrubber = this.findByClassNameIn(children, 'scrubber');
    const frameDisplay = this.findByClassNameIn(children, 'hover-frame-display');

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
    const scubberTrack = this.findByClassNameIn(Array.from(scrubber.children), 'md-slider-track');
    const scrubberTrackWidth = scubberTrack.offsetWidth;
    const newFrameNumber = relativeMouseX * this.largestFrameNumber / scrubberTrackWidth;

    this.hoverFrame = new Frame(this.playerState.framesPerSecond).setFromFrameNumber(newFrameNumber);
  }

  private updateHoverFrameDisplayPositionWith(relativeMouseX: number, scrubber: any, frameDisplay: any): void {
    const computedStyle = this.window.getComputedStyle(frameDisplay);
    const rawWidth = parseFloat(computedStyle.getPropertyValue('width'));
    const actualWidth =
      rawWidth
      + parseInt(computedStyle.getPropertyValue('border-left-width'))
      + parseInt(computedStyle.getPropertyValue('border-right-width'))
      + parseInt(computedStyle.getPropertyValue('padding-left'))
      + parseInt(computedStyle.getPropertyValue('padding-right'));

    this.hoverFrameDisplayPosition = this.constrainTo(0, scrubber.offsetWidth - actualWidth, relativeMouseX - (rawWidth / 2));
  }

  private constrainTo(minimumPosition: number, maximumPosition: number, position: number) {
    return Math.max(minimumPosition, Math.min(maximumPosition, position));
  }
}
