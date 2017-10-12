import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UiState } from '../../shared/services/ui.state';

@Component({
  moduleId: module.id,
  selector: 'app-loading-indicator',
  template: `<mat-progress-bar mode="indeterminate" color="accent" *ngIf="showLoadingIndicator | async"></mat-progress-bar>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLoadingIndicatorComponent {
  constructor(private uiState: UiState) { }

  public get showLoadingIndicator(): Observable<boolean> {
    return this.uiState.data.map(data => data.loadingIndicator);
  }
}
