import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'line-item-transcode-select-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-select
    *ngIf="!readOnly"
      placeholder="Delivery format/codec"
      [(ngModel)]="selectedTarget"
      (change)="selectTarget.emit($event.value)">
        <md-option
          *ngFor="let target of transcodeTargets"
          [value]="target">{{ 'ASSET.TRANSCODE_TARGETS.' + target | translate }}
        </md-option>
    </md-select>
    <div *ngIf="readOnly">
      <p>{{ 'ASSET.TRANSCODE_TARGETS.' + selectedTarget | translate }}</p>
    </div>
  `
})
export class LineItemTranscodeSelectComponent {
  @Input() transcodeTargets: string[];
  @Input() selectedTarget: string;
  @Input() readOnly: boolean = false;
  @Output() selectTarget: EventEmitter<any> = new EventEmitter();
}
