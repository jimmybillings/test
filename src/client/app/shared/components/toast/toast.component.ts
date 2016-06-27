import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'toast',
  templateUrl: 'toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ToastComponent implements OnChanges {
  @Input() UiState: any;
  public message: string;
  public type: string;

  constructor() {
    this.message = null;
    this.type = null;
  }

  ngOnChanges(changes: any) {
    if (changes.UiState.currentValue.message) {
      this.updateMessage(changes.UiState.currentValue);
    } else {
      this.message = null;
      this.type = null;
    }
  }

  public updateMessage(changes: any): void {
    this.message = changes.message;
    this.type = changes.type;
  }
}
