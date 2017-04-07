import { DashboardComponent } from './dashboard.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Admin Dashboard Component', () => {
    let componentUnderTest: DashboardComponent;
    let mockCurrentUserService: any;

    beforeEach(() => {
      mockCurrentUserService = { fullName: () => Observable.of('Ross Edfort') };

      componentUnderTest = new DashboardComponent(mockCurrentUserService);
    });

    describe('instantiated', () => {
      it('with current user', () => {
        expect(componentUnderTest.currentUser).toBeDefined();
      });
    });
  });
}
