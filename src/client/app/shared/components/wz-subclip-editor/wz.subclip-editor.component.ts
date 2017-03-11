import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-editor',
  template: `
    <wz-advanced-player
      [window]="window"
      [asset]="asset"
      [displayAllControls]="false"
      (onUpdateSubclipData)="onPlayerSubclipUpdate($event)">
    </wz-advanced-player>

    <wz-subclip-edit-actions layout="row" layout-align="end center"
      [hasStoredMarkers]="asset.timeStart != undefined"
      [dialog]="dialog"
      [inMarkerFrame]="inMarkerFrame"
      [outMarkerFrame]="outMarkerFrame"
      (saveMarkers)="onSaveMarkers($event)">
    </wz-subclip-edit-actions>
  `
})

export class WzSubclipEditorComponent {
  @Input() window: any;
  @Input() asset: any;
  @Input() dialog: any;
  @Output() onSubclip = new EventEmitter();

  public inMarkerFrame: Frame;
  public outMarkerFrame: Frame;

  public onPlayerSubclipUpdate(event: any): void {
    this.inMarkerFrame = event.in;
    this.outMarkerFrame = event.out;
  }

  public onSaveMarkers(event: any): void {
    this.onSubclip.emit(event);
  }
}
