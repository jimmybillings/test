import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Frame } from 'wazee-frame-formatter';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-edit-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `
})

export class SubclipEditActionsComponent {
  @Input() dialog: any;
  @Input() hasStoredMarkers: boolean;
  @Input() inMarkerFrame: Frame;
  @Input() outMarkerFrame: Frame;
  @Output() saveMarkers: EventEmitter<any> = new EventEmitter<any>();

  public showRemoveMarkers(): boolean {
    return this.hasStoredMarkers && !this.inMarkerFrame && !this.outMarkerFrame ? true : false;
  }

  public onSave(): void {
    this.saveMarkers.emit({ in: this.inMarkerFrame.frameNumber, out: this.outMarkerFrame.frameNumber });
  }

  public onRemove(): void {
    this.saveMarkers.emit({ in: undefined, out: undefined });
  }
}
