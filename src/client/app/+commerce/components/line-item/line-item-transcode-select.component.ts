import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'line-item-transcode-select-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="delivery-format">
      <mat-select *ngIf="!readOnly"
        placeholder="{{ 'ASSET.TRANSCODE_TARGETS.FORM_PLACEHOLDER' | translate }}"
        [(ngModel)]="selectedTarget"
        (change)="selectTarget.emit($event.value)">
          <mat-option
            *ngFor="let target of transcodeTargets"
            [value]="target">{{ 'ASSET.TRANSCODE_TARGETS.' + target | translate }}
          </mat-option>
      </mat-select>
      <div *ngIf="readOnly" class="read-only-transcode">
        <span class="cart-asset-metadata mat-caption">
          <strong>{{ 'ASSET.TRANSCODE_TARGETS.FORM_PLACEHOLDER' | translate }}: </strong>
          {{ 'ASSET.TRANSCODE_TARGETS.' + selectedTarget | translate }}
        </span>
      </div>
    </div>
  `
})
export class LineItemTranscodeSelectComponent {
  @Input() transcodeTargets: string[];
  @Input() selectedTarget: string;
  @Input() readOnly: boolean = false;
  @Output() selectTarget: EventEmitter<any> = new EventEmitter();
}
