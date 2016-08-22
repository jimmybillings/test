import {
  // inject,
  addProviders
} from '../../../imports/test.imports';

import {WzPlayerComponent} from './wz.player.component';

export function main() {
  describe('Player Component', () => {
    beforeEach(() => {
        addProviders([
        WzPlayerComponent
      ]);
    });
  });
}
