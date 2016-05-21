import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { WzListComponent } from './wz.list.component';

export function main() {
  describe('WZ List component', () => {
    beforeEachProviders(() => [
      WzListComponent,
    ]);

    it('Should create instance of WzList',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzListComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzListComponent).toBeTruthy();
        });
      })
    );

    it('should have a sortBy function that emits a sort event with opposite of toggleFlag - false', inject([WzListComponent], (component: WzListComponent) => {
      spyOn(component.sort, 'emit');
      component.toggleFlag = false;
      component.sortBy('createdOn');
      expect(component.sort.emit).toHaveBeenCalledWith({ s: 'createdOn', d: true });
    }));

    it('should have a sortBy function that emits a sort event with opposite of toggleFlag - true', inject([WzListComponent], (component: WzListComponent) => {
      spyOn(component.sort, 'emit');
      component.toggleFlag = true;
      component.sortBy('createdOn');
      expect(component.sort.emit).toHaveBeenCalledWith({ s: 'createdOn', d: false });
    }));
  });
}
