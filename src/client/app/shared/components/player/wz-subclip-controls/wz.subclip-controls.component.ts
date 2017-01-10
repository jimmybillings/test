import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SubclipMarkers } from '../../../interfaces/asset.interface';

import { Frame } from 'wazee-frame-formatter';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-controls',
  templateUrl: './wz.subclip-controls.html'
})

export class WzSubclipControlsComponent {
  @Input() currentTime: number;
  @Input() markers: SubclipMarkers = {};

  @Input()
  public set duration(duration: number) {
    this.clipDuration = duration;
    if (!this.markers.in) this.markers.in = 0;
    if (!this.markers.out) this.markers.out = duration;
  }

  @Output() seekRequested: EventEmitter<number> = new EventEmitter<number>();
  @Output() playSubclipRequested: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() markersChanged: EventEmitter<SubclipMarkers> = new EventEmitter<SubclipMarkers>();
  @Output() markersCleared: EventEmitter<null> = new EventEmitter<null>();

  private clipDuration: number;

  public get duration(): number {
    return this.clipDuration;
  }

  public setInMarker(): void {
    this.markers.in = this.constrainedCurrentTime;
    if (this.markers.in > this.markers.out) this.markers.out = this.markers.in;
    this.emitMarkersEvent();
    // Ed: Here as an example of how I am able to use the wazee-frame-formatter library
    let frame: Frame = new Frame(23.97);
    console.log(frame.setFromSeconds(this.markers.in).frameNumber);
  }

  public setOutMarker(): void {
    this.markers.out = this.constrainedCurrentTime;
    if (this.markers.out < this.markers.in) this.markers.in = this.markers.out;
    this.emitMarkersEvent();
    // Ed: Here as an example of how I am able to use the wazee-frame-formatter library
    let frame: Frame = new Frame(23.97);
    console.log(frame.setFromSeconds(this.markers.out).frameNumber);
  }

  public gotoInMarker(): void {
    this.seekRequested.emit(this.markers.in);
  }

  public gotoOutMarker(): void {
    this.seekRequested.emit(this.markers.out);
  }

  public playInToOut(): void {
    this.playSubclipRequested.emit(this.markers);
  }

  public clear(): void {
    this.markers = { in: 0, out: this.clipDuration };
    this.markersCleared.emit();
  }

  private get constrainedCurrentTime() {
    return Math.min(Math.max(0, this.currentTime), this.clipDuration);
  }

  private emitMarkersEvent(): void {
    if (this.markers.in > 0 || this.markers.out < this.clipDuration) {
      this.markersChanged.emit(this.markers);
    } else {
      this.markersCleared.emit();
    }
  }
}
