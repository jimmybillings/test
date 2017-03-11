import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-editor',
  template: `
    <wz-advanced-player
      [window]="window"
      [asset]="asset"
      [dialog]="dialog"
      [displayContext]="'subClipEditDialog'"
      (onSubclip)="onPlayerSubclip($event)">
    </wz-advanced-player>
  `
})

export class WzSubclipEditorComponent {
  @Input() window: any;
  @Input() asset: any;
  @Input() dialog: any;
  @Output() onSubclip = new EventEmitter();

  public onPlayerSubclip(event: any): void {
    this.onSubclip.emit(event);
  }
}
