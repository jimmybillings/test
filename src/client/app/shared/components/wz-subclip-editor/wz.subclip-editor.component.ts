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

    <section layout="row" layout-align="end">
      <button md-button color="primary" (click)="dialog.close()">
        {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.CANCEL_BTN_LABEL' | translate }}
      </button>

      <button md-button class="is-outlined" color="primary"
        *ngIf="!showRemoveMarkers()"
        [disabled]="!inMarkerFrame || !outMarkerFrame"
        (click)="onSave()">
        {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.SAVE_BTN_LABEL' | translate }}
      </button>
      
      <button md-button class="is-outlined" color="accent"
        *ngIf="showRemoveMarkers()"
        (click)="onRemove()">
        {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.REMOVE_BTN_LABEL' | translate }}
      </button>
    </section>
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

  public showRemoveMarkers(): boolean {
    return this.asset.timeStart && !this.inMarkerFrame && !this.outMarkerFrame;
  }

  public onSave(): void {
    this.onSubclip.emit({ in: this.inMarkerFrame.frameNumber, out: this.outMarkerFrame.frameNumber });
  }

  public onRemove(): void {
    this.onSubclip.emit({ in: undefined, out: undefined });
  }
}
