import {
  beforeEachProvidersArray,
  inject,
  addProviders
} from '../../imports/test.imports';

import { AppNavComponent } from './app-nav.component';


export function main() {
  describe('App Nav Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        AppNavComponent
      ]);
    });

    it('Should fire an event to logout a user', inject([AppNavComponent], (component: any) => {
      // spyOn(component.onLogOut, 'emit');
      // component.logOut(event);
      // expect(component.onLogOut.emit).toHaveBeenCalledWith(event);
    }));
  });
}
