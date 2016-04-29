import {
TestComponentBuilder,
describe,
expect,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {Player} from './player.component';


export function main() {
  describe('Player Component', () => {

    beforeEachProviders(() => [
      Player
    ]);

    it('Should have a player instance',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(Player).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Player).toBeTruthy();
        });
      }));
  });
}
