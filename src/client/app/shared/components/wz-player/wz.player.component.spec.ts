import {
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../../imports/test.imports';

import {WzPlayerComponent} from './wz.player.component';

export function main() {
  describe('Player Component', () => {

    beforeEachProviders(() => [
      WzPlayerComponent
    ]);

    it('Should have a player instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzPlayerComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzPlayerComponent).toBeTruthy();
        });
      }));
  });
}
