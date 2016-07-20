import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../imports/test.imports';

import { AppNavComponent } from './app-nav.component';


export function main() {
  describe('App Nav Component', () => {

    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      AppNavComponent
    ]);

    it('Should have a header instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AppNavComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AppNavComponent).toBeTruthy();
        });
      }));

    it('Should fire an event to logout a user', inject([AppNavComponent], (component: any) => {
      spyOn(component.onLogOut, 'emit');
      component.logOut(event);
      expect(component.onLogOut.emit).toHaveBeenCalledWith(event);
    }));
  });
}
