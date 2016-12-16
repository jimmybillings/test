import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { WzPlayerComponent } from '../wz-player/wz.player.component';
import { WzSubclipControlsComponent } from '../wz-subclip-controls/wz.subclip-controls.component';
import { SubclipMarkers } from '../../interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-player',
  templateUrl: './wz.subclip-player.html'
})

export class WzSubclipPlayerComponent {
  @Input() asset: any;
  @Input() subclipMarkers: SubclipMarkers;

  @Output() subclipMarkersChanged: EventEmitter<SubclipMarkers> = new EventEmitter<SubclipMarkers>();
  @Output() subclipMarkersCleared: EventEmitter<null> = new EventEmitter<null>();

  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;
  @ViewChild(WzSubclipControlsComponent) subclipControls: WzSubclipControlsComponent;

  public onTimeUpdate(newTime: number): void {
    this.subclipControls.currentTime = newTime;
  }

  public onDurationUpdate(duration: number): void {
    this.subclipControls.duration = duration;
  }

  public requestSeekTo(seekTarget: number): void {
    this.player.seekTo(seekTarget);
  }

  public requestPlaySubclip(markers: SubclipMarkers): void {
    this.player.playSubclip(markers);
  }

  public onSubclipMarkersChanged(newMarkers: SubclipMarkers): void {
    this.subclipMarkersChanged.emit(newMarkers);
  }

  public onSubclipMarkersCleared(): void {
    this.subclipMarkersCleared.emit();
  }
}
