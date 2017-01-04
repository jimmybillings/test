import { DashboardComponent } from './dashboard.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Admin Dashboard Component', () => {
    let componentUnderTest: DashboardComponent;
    let mockCurrentUser: any;

    beforeEach(() => {
      mockCurrentUser = { fullName: () => Observable.of('Ross Edfort') };

      componentUnderTest = new DashboardComponent(mockCurrentUser);
    });

    describe('instantiated', () => {
      it('with current user', () => {
        expect(componentUnderTest.currentUser).toBeDefined();
      });
    });
  });
}
