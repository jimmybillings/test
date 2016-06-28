import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'toast',
  templateUrl: 'toast.html',
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ToastComponent {
  @Input() message: string;
  @Input() type: string;
}
