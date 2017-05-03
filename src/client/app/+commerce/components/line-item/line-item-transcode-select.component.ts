import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'line-item-transcode-select-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-select
    *ngIf="!readOnly"
      placeholder="{{ 'ASSET.TRANSCODE_TARGETS.FORM_PLACEHOLDER' | translate }}"
      [(ngModel)]="selectedTarget"
      (change)="selectTarget.emit($event.value)">
        <md-option
          *ngFor="let target of transcodeTargets"
          [value]="target">{{ 'ASSET.TRANSCODE_TARGETS.' + target | translate }}
        </md-option>
    </md-select>
    <div *ngIf="readOnly" class="read-only-transcode">
      <span class="md-caption asset-name">{{ 'ASSET.TRANSCODE_TARGETS.FORM_PLACEHOLDER' | translate }}</span>
      <div>{{ 'ASSET.TRANSCODE_TARGETS.' + selectedTarget | translate }}</div>
    </div>
  `,
  styles: [
    `.read-only-transcode { margin-top: -5px; margin-left: 40px;}`
  ]
})
export class LineItemTranscodeSelectComponent {
  @Input() transcodeTargets: string[];
  @Input() selectedTarget: string;
  @Input() readOnly: boolean = false;
  @Output() selectTarget: EventEmitter<any> = new EventEmitter();
}
