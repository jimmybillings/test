import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import {PlayerComponent} from './player.component';


export function main() {
  describe('Player Component', () => {

    beforeEachProviders(() => [
      PlayerComponent
    ]);

    it('Should have a player instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(PlayerComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof PlayerComponent).toBeTruthy();
        });
      }));
  });
}
