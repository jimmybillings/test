import { Observable } from 'rxjs/Rx';

import { AssetShareComponent } from './asset-share.component';

export function main() {
  describe('Asset Share Component', () => {
    let componentUnderTest: AssetShareComponent;
    let mockCurrentUser: any;

    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockCurrentUser = { data: Observable.of({}) };

      componentUnderTest = new AssetShareComponent(mockCurrentUser, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

