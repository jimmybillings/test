import { describe, expect, it, beforeEachProviders, injectAsync, TestComponentBuilder } from 'angular2/testing';
import {WzList} from './wz.list.component';

export function main() {
  describe('WZ List component', () => {
    beforeEachProviders(() => [
      WzList
    ]);
    
    it('Should create instance of WzList',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(WzList).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzList).toBeTruthy();
        });
      })
    );
  });
}
