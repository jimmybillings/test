import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-notification',
  template:
  `<div class="notification">
      <p>{{notice | translate}}</p>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzNotificationComponent {
  @Output() onDestroy = new EventEmitter();
  @Input() notice: string;
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    this.onDestroy.emit();
  }
}
