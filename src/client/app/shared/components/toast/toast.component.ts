import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'toast',
  templateUrl: 'toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ToastComponent {
  @Input() message: string;
  @Input() type: string;
}
