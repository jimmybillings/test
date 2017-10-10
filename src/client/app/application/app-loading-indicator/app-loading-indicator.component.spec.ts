import { Observable } from 'rxjs/Observable';
import { AppLoadingIndicatorComponent } from './app-loading-indicator.component';

export function main() {
  describe('App Loading Indicator Component', () => {
    let componentUnderTest: AppLoadingIndicatorComponent;
    let mockUiState: any;

    describe('showLoadingIndicator getter', () => {
      it('returns true when the value in the store is true', () => {
        mockUiState = { data: Observable.of({ loadingIndicator: true }) };
        componentUnderTest = new AppLoadingIndicatorComponent(mockUiState);

        let showLoading: boolean;
        componentUnderTest.showLoadingIndicator.take(1).subscribe(loading => showLoading = loading);
        expect(showLoading).toBe(true);
      });

      it('returns false when the value in the store is false', () => {
        mockUiState = { data: Observable.of({ loadingIndicator: false }) };
        componentUnderTest = new AppLoadingIndicatorComponent(mockUiState);

        let showLoading: boolean;
        componentUnderTest.showLoadingIndicator.take(1).subscribe(loading => showLoading = loading);
        expect(showLoading).toBe(false);
      });
    });
  });
}
