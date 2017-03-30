import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'line-item-transcode-select-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-select
      placeholder="Delivery format/codec"
      [(ngModel)]="selectedTarget">
        <md-option
          *ngFor="let target of transcodeTargets"
          [value]="target"
          (onSelect)="selectTarget.emit(target)">{{ 'ASSET.TRANSCODE_TARGETS.' + target | translate }}
        </md-option>
    </md-select>
  `
})
export class LineItemTranscodeSelectComponent {
  @Input() transcodeTargets: string[];
  @Input() selectedTarget: string;
  @Output() selectTarget: EventEmitter<any> = new EventEmitter();
}
