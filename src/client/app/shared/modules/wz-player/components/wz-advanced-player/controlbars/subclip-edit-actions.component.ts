import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'subclip-edit-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-button color="primary" (click)="dialog.close()">Cancel</button>
    <button md-button class="is-outlined" color="primary" (click)="onSave()">Save sub-clipping</button>
  `
})

export class SubclipEditActionsComponent {
  @Input() dialog: any;
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public onSave(): void {
    this.request.emit({ type: PlayerRequestType.SaveMarkers });
  }
}
